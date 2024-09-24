const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;


// Middleware configuration
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i4eibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const jobsCollection = client.db("hiringStaffDB").collection("jobs");
    const candidatesCollection = client
      .db("hiringStaffDB")
      .collection("candidates");
    const recruitersCollection = client
      .db("hiringStaffDB")
      .collection("recruiters");

    // API GET
    app.get("/jobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });
    app.get("/candidates", async (req, res) => {
      const result = await candidatesCollection.find().toArray();
      res.send(result);
    });
    app.get("/recruiters", async (req, res) => {
      const result = await recruitersCollection.find().toArray();
      res.send(result);
    });


    // Others
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hiring Staff Server Is Running!");
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
