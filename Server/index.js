const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    // ===============================================================
    app.get("/", (_req, res) => {
      res.send("Cooking.....");
    });
    // ======================= Class =================================
    app.post("/add-class", (req, res) => {
      try {
        const newClass = req.body;
        classCollection.insertOne(newClass);
        res.json({ success: true, status: 200 });
      } catch (error) {
        res.json({ success: false, error: error });
      }
    });

    app.get("/classes/:day", async (req, res) => {
      const day = req.params.day;
      const result = await classCollection.find({ day: day }).toArray();
      res.send(result);
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
