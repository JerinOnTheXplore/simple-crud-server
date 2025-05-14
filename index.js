const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT|| 3000;
app.use(cors());
app.use(express.json());

// user simpleDBUser

// pass tUaaf5PG0vOw26MK

const uri = "mongodb+srv://simpleDBUser:tUaaf5PG0vOw26MK@cluster0.oeq8sgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
   try{
    await client.connect();
    
    const database = client.db("usersdb");
    const usersCollection = database.collection('users');

    app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/users',async(req,res)=>{
        console.log('Data in the server',req.body);
        const newUser = req.body;
       const result = await  usersCollection.insertOne(newUser);
       res.send(result);
    })

    app.delete('/users/:id',async(req,res)=>{
        console.log(req.params);
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })

    await client.db("admin").command({ping:1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
   }
   finally{

   }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
   res.send('Simple CRUD Server Running');
});
app.listen(port,()=>{
    console.log(`Simple CRUD server running on ${port}`);
})