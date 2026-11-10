import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import 'dotenv/config'
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(
  `${process.env.MONGO_DR_URI}`
);
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

app.get("/users",async(req,res)=>{
    const data = await users.find({}).toArray();
    res.send(data);
})

app.get('/jobs',async(req,res)=>{
    const data = await jobs.find({}).toArray();
    res.send(data);
})

app.post('/jobs',async(req,res)=>{
    const body = req.body;
    const result = await jobs.insertOne(body);
    res.send(result);
})

app.listen(port, () => {
  console.log(`hireloop app listening on port ${port}`);
});
