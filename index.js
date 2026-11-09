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

app.get("/", (req, res) => {
  res.send({ msg: "created server sucessfull" });
});

app.listen(port, () => {
  console.log(`hireloop app listening on port ${port}`);
});
