const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const userData = require("./user.json"); // data File
const bodyParser = require("body-parser");
// on localhost
const uri = "mongodb://localhost:27017"; // localhost from mongoDb on port 27017

const app = express();
app.use(bodyParser.json());

// request to mongodb by uri
const client = new MongoClient(uri);

// connection to mongodb documents
const dbs = client.db("personal-blogs"); // set YOUR-DB
const collDbs = dbs.collection("personal-table"); // set YOUR-COLLECTION

// show data in collection
async function show() {
  try {
    const cursor = collDbs.find({});
    const res = await cursor.toArray();

    console.log(); //response to show
    //
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// added some data from 'user.json'
async function add() {
  try {
    const res = await collDbs.insertMany(userData);

    console.log(); //response to add

    if (res.acknowledged === true) {
      console.log("added is Successfully");
    }
  } finally {
    await client.close();
  }
}

// deleted documents
async function deletes() {
  try {
    // set a query to deleted like id or grade
    const query = { KEY: "KEYVALUE" };
    const res1 = await collDbs.deleteMany(query);

    // deleted all documents
    const res2 = await collDbs.deleteMany({});

    console.log(); //response to delete

    if (res.acknowledged === true) {
      console.log("deleted is Successfully");
    }
  } finally {
    await client.close();
  }
}
// update documents
async function update() {
  try {
    // const filter = { grade: "A" };

    const updateDocs = { $set: { update: null } };
    const res = await collDbs.updateMany(filter, updateDocs);

    console.log(res); // respose to update
  } finally {
    await client.close();
  }
}
// filter documents
async function filter() {
  try {
    const filterDoc = { update: false, grade: "B" };

    const res = await collDbs.find(filterDoc).toArray();

    console.log(res); // response to filter
  } finally {
    await client.close();
  }
}

//  -- callback function --

// show().catch(console.dir);
// add().catch(console.dir);
// deletes().catch(console.dir);
// filter().catch(console.dir);

// read all data
app.get("/data", (req, res) => {
  res.json(userData);
});

// read data by ID
app.get("/data/:id", (req, res) => {
  const data = userData.find((i) => i._id === parseInt(req.params.id));
  if (!data) return res.status(404).send("data is not found by this ID");
  res.json(data);
});

// delete data by id in  "/data/delete/:id"
app.delete("/data/delete/:id", (req, res) => {
  const findIndex = userData.find((i) => i._id === parseInt(req.params.id));
  if (!findIndex) return res.status(404).send("delete is not successfull!");
  const deleteItem = userData.splice(findIndex, 1);
  res.json(deleteItem);
});

const port = 3000;
app.listen(port, function () {
  console.log(`app listing to port ${port}`);
});
