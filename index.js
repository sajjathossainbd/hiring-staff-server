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

    const usersCollection = client.db("hiringStaffDB").collection("users");
    const jobsCollection = client.db("hiringStaffDB").collection("jobs");
    const candidatesCollection = client
      .db("hiringStaffDB")
      .collection("candidates");
    const recruitersCollection = client
      .db("hiringStaffDB")
      .collection("recruiters");

    // Api for users
    // add user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exists", insertId: null })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // get user
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });




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
