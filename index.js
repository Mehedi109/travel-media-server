const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ppmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('connected');
    const database = client.db('tourism');
    const destinationCollection = database.collection('destinations');
    const ordersCollection = database.collection('orders');
    // console.log(destinationCollection);
    // GET API
    app.get('/destinations', async (req, res) => {
      const cursor = destinationCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // GET API for specific id
    app.get('/destinations/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await destinationCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // POST API
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      console.log('hit server', orders);
      res.json(result);
    });
    // POST API
    app.post('/addDestination', async (req, res) => {
      const destination = req.body;
      const result = await destinationCollection.insertOne(destination);
      console.log('hit server', destination);
      res.json(result);
    });
    //  GET API for orders of logged in user
    app.get('/myOrders/:email', async (req, res) => {
      // console.log(req.params.email);
      // const cursor = ordersCollection.find({});
      // const result = await cursor.toArray();
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      // console.log(result);
    });
    // GET API for orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // GET API for specific order
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // UPDATE API for orders
    app.put('/orders/:id', async (req, res) => {});
    // DELETE API for orders
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running the server');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
