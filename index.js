import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(`${process.env.MONGO_DR_URI}`);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloop");
const users = database.collection("user");
const jobs = database.collection("jobs");

app.get("/", (req, res) => {
  res.send({ msg: "created server sucessfull" });
});

app.get("/users", async (req, res) => {
  const data = await users.find({}).toArray();
  res.send(data);
});

app.get("/jobs", async (req, res) => {
  const quary = {};
  if (req.query) {
    if (req.query.isRemote) {
      quary.isRemote = req.query.isRemote === "true";
    }

    if (req.query.jobType) {
      if (req.query.jobType === "All-Job") {
        
      } else {
        quary.jobType = req.query.jobType;
      }
    }

    if (req.query.category) {
      quary.category = req.query.category;
    }
    if (req.query.search) {
      quary.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { responsibilities: { $regex: req.query.search, $options: "i" } },
        { qualifications: { $regex: req.query.search, $options: "i" } },
      ];
    }
  }
  const data = await jobs.find(quary).toArray();
  res.send(data);
});

app.post("/jobs", async (req, res) => {
  const body = req.body;
  const result = await jobs.insertOne(body);
  res.send(result);
});

app.delete("/jobs/:id", async (req, res) => {
  const params = req.params.id;
  const query = { _id: new ObjectId(params) };
  const result = await jobs.deleteOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`hireloop app listening on port ${port}`);
});
