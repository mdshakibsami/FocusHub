const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // ======================== Collections ==========================
    const classCollection = client.db("FocusHub").collection("classes");
    const transactionCollection = client
      .db("FocusHub")
      .collection("transactions");

    // ===============================================================
    app.get("/", (_req, res) => {
      res.send("Cooking.....");
    });

    // // Query to clear a database collection
    // app.get("/deleteAll", async (_req, res) => {
    //   await transactionCollection.deleteMany({});
    //   res.json({success:true})
    // });

    // ====================== Budget Tracker =========================
    app.post("/add-transaction", async (req, res) => {
      try {
        const newClass = req.body;
        const result = await transactionCollection.insertOne(newClass);
        res.send(result);
      } catch (error) {
        res.json({ success: false, error: error });
      }
    });

    app.get("/all-transactions", async (_req, res) => {
      const result = await transactionCollection.find({}).toArray();
      res.send(result);
    });

    // get the income count and expense count
    app.get("/transaction-count", async (_req, res) => {
      try {
        const result = await transactionCollection
          .aggregate([
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
          ])
          .toArray();

        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    });

    // get all income count
    app.get("/all-income-count", async (_req, res) => {
      try {
        const result = await transactionCollection
          .aggregate([
            {
              $group: {
                _id: "$title",
                count: { $sum: 1 },
              },
            },
          ])
          .toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    });

    app.put("/update-transaction/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updatedClass = req.body;
        console.log(id, updatedClass);
        const result = await transactionCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: updatedClass }
        );
        res.send(result);
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });

    app.delete("/transaction/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await transactionCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json({ success: result.deletedCount === 1, status: 200 });
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });
    // ===============================================================

    // ======================= Class =================================
    app.post("/add-class", async (req, res) => {
      try {
        const newClass = req.body;
        const result = await classCollection.insertOne(newClass);
        res.send(result);
      } catch (error) {
        res.json({ success: false, error: error });
      }
    });

    app.get("/classes/:day", async (req, res) => {
      const day = req.params.day;
      const result = await classCollection.find({ day: day }).toArray();
      res.send(result);
    });

    app.get("/all-day-count", async (_req, res) => {
      try {
        const result = await classCollection
          .aggregate([
            {
              $group: {
                _id: "$day",
                count: { $sum: 1 },
              },
            },
          ])
          .toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    });

    app.get("/completed", async (_req, res) => {
      const sizeOfClasses = await classCollection.estimatedDocumentCount();
      const sizeOfCompleted = await classCollection.countDocuments({
        status: true,
      });
      res.json({ size: sizeOfClasses, completed: sizeOfCompleted });
    });

    app.put("/update-class/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updatedClass = req.body;
        const result = await classCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: updatedClass }
        );
        res.send(result);
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });

    app.patch("/update-class/completed/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await classCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: { status: true } }
        );
        res.send(result);
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });

    app.patch("/update-class/incomplete/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await classCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: { status: false } }
        );
        res.send(result);
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });

    app.delete("/classes/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await classCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json({ success: result.deletedCount === 1, status: 200 });
      } catch (error) {
        res.json({ success: false, error, message: "Something is Wrong" });
      }
    });
    // ===============================================================

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
