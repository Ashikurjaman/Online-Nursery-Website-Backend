const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URL;
// "mongodb+srv://Admin_1:admin_1@cluster0.dcb6faa.mongodb.net/treePlants?retryWrites=true&w=majority&appName=Cluster0";

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
    const database = client.db("treePlants");
    const PlantCollection = database.collection("treePlant");

    app.get("/products", async (req, res) => {
      let searchTerm = "";
      if (req.body?.searchTerm) {
        searchTerm = req.body.searchTerm;
      }

      const searchAble = ["title", "price"];

      const searchProduct = PlantCollection.find({
        $or: searchAble.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
        price: { $gte: 0, $lte: 1000 },
      });
      let limit = Number(payload?.limit);

      let skip = 0;
      if (payload?.page) {
        const page = Number(payload.page);
        skip = (page - 1) * limit;
      }

      const excludeField = ["searchTerm", limit];
      const queryObj = { ...req.query };

      excludeField.forEach((e) => delete queryObj[e]);

      const result = await searchProduct.find(queryObj).skip(skip).limit(limit);
      console.log(result);

      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await PlantCollection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await PlantCollection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    app.post("/category", async (req, res) => {
      const data = req.body;
      console.log(user);
      const result = await PlantCollection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await PlantCollection.findOne(query);
      res.send(product);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await PlantCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await PlantCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const result = await PlantCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: data },
        { new: true }
      );

      res.send(result);
    });
    app.patch("/category/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const result = await PlantCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: data },
        { new: true }
      );

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
