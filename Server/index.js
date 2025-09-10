const express = require("express");
require("dotenv").config();
const cors = require("cors");

const fs = require("fs");
const path = require("path");

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
    const subjectCollection = client.db("FocusHub").collection("subjects");
    const questionCollection = client.db("FocusHub").collection("questions");
    const flashcardCollection = client.db("FocusHub").collection("flashcards");

    // ===============================================================
    app.get("/", (_req, res) => {
      res.send("Cooking.....");
    });

    // // Query to clear a database collection
    // app.get("/deleteAll", async (_req, res) => {
    //   await subjectCollection.deleteMany({});
    //   res.json({success:true})
    // });

    // ====================== Flashcards  ==========================

    app.post("/flashcard", async (req, res) => {
      const flashcard = req.body;
      const result = await flashcardCollection.insertOne(flashcard);
      res.send(result);
    });

    app.get("/flashcard", async (req, res) => {
      const flashcard = await flashcardCollection.find({}).toArray();
      res.send(flashcard);
    });

    app.delete("/flashcard/:id", async (req, res) => {
      const { id } = req.params;
      const result = await flashcardCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.patch("/flashcard/:id", async (req, res) => {
      const { id } = req.params;
      const result = await flashcardCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { completed: true } }
      );
      res.send(result);
    });

    // ====================== Q&A Generator  ==========================
    // GET /qa-generator?subject=Math&type=MCQ&number=10
    app.get("/qa-generator", async (req, res) => {
      const { subject, type, difficulty, number } = req.query;
      console.log(subject, type, difficulty, number);
      const result = await questionCollection
        .find({
          $and: [
            { subject: subject },
            { type: type },
            { difficulty: difficulty },
          ],
        })
        .toArray();

      const questionsArray = result[0].questions;
      const length = questionsArray.length;

      const newQuestions = [];
      for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * length);
        // console.log(i, randomIndex, questionsArray[randomIndex]);
        newQuestions.push(questionsArray[randomIndex]);
      }
      res.json({ success: true, newQuestions });
    });

    // ====================== Study Planner ==========================

    // => Adding Subject
    app.post("/add-subject", async (req, res) => {
      const subjectData = req.body;
      const newSubject = subjectData.subject;
      const exists = await subjectCollection.findOne({ subject: newSubject });
      if (exists) {
        res.json({ message: "already exist" });
      } else {
        const result = await subjectCollection.insertOne(subjectData);
        res.send(result);
      }
    });

    // => Getting All Subjects
    app.get("/get-subject", async (req, res) => {
      const result = await subjectCollection.find().toArray();
      res.send(result);
    });
    // => delete by subject
    app.delete("/delete/:subject", async (req, res) => {
      const subject = req.params.subject;
      const result = await subjectCollection.deleteOne({ subject: subject });
      res.send(result);
    });

    // => Setting all Subtasks
    app.post("/subjects/subtask", async (req, res) => {
      try {
        const newTask = req.body;
        const { subject, ...taskData } = newTask;
        const result = await subjectCollection.updateOne(
          {
            subject: newTask.subject,
          },
          { $push: { task: newTask } }
        );
        res.send(result);
      } catch (error) {
        res.json({ success: false });
      }
    });

    // delete subtask
    app.delete("/delete-subtask/:subject/:index", async (req, res) => {
      const { subject, index } = req.params;
      const taskIndex = parseInt(index, 10); // convert to number

      try {
        // Step 1: unset the element at that index
        await subjectCollection.updateOne(
          { subject },
          { $unset: { [`task.${taskIndex}`]: 1 } }
        );

        // Step 2: remove null values (clean up)
        const result = await subjectCollection.updateOne(
          { subject },
          { $pull: { task: null } }
        );

        res.send(result);
      } catch (err) {
        console.error("Error deleting subtask:", err);
        res.status(500).send("Error deleting subtask");
      }
    });

    // handle status
    app.put("/update-status", async (req, res) => {
      const getStatus = req.body.status;
      const index = req.body.tablerow;
      const subject = req.body.subject;
      if (getStatus === "Completed")
        res.json({ message: "Task is already completed" });
      let newStatus = "Start";

      if (getStatus === "Start") newStatus = "In Progress";
      else if (getStatus === "In Progress") newStatus = "Completed";

      const result = await subjectCollection.updateOne(
        { subject },
        {
          $set: { [`task.${index}.status`]: newStatus },
        }
      );

      res.send(result);
    });

    // count subject
    app.get("/subject-count", async (_req, res) => {
      try {
        const subjects = await subjectCollection.find().toArray();
        let totalSubtasks = 0;
        let completedSubtasks = 0;

        subjects.forEach((subject) => {
          if (Array.isArray(subject.task)) {
            totalSubtasks += subject.task.length;
            completedSubtasks += subject.task.filter(
              (t) => t.status === "Completed"
            ).length;
          }
        });

        res.json({ totalSubtasks, completedSubtasks });
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    });
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

    app.get("/all-transactions/:search", async (req, res) => {
      try {
        const search = req.params.search;
        if (search === "All") {
          const result = await transactionCollection.find({}).toArray();
          res.send(result);
        } else if (search === "Income" || search === "Expense") {
          const result = await transactionCollection
            .find({ type: search })
            .toArray();
          res.send(result);
        }
      } catch (error) {
        res.send("Server Error ", error);
      }
    });

    // get the income count and expense count
    app.get("/transaction-count", async (_req, res) => {
      try {
        const result = await transactionCollection
          .aggregate([
            {
              $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" },
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
