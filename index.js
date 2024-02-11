const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://test1:test123@cluster0.dcb6faa.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const userCollection = database.collection("users");


      app.get('/users', async(req,res)=>{
        const curser = userCollection.find();
        const result = await curser.toArray();
        res.send(result);
      })

    app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result)
    });

    app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)} 
      const user = await userCollection.findOne(query);
      res.send(user)
    })

    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)} 
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      const filter = {_id: new ObjectId (id)} 
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name:user.name,
          email:user.email
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
     
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
