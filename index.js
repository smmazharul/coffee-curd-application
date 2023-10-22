const express=require('express');
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express()
const port=process.env.PORT || 5000;


//midleware
app.use(cors())
app.use(express.json())




// connect with mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.wl6clts.mongodb.net/?retryWrites=true&w=majority`;


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
    const coffeCollection= client.db("coffeeDb").collection("coffee");


    app.get('/coffee',async(req,res)=>{
        const cursor=coffeCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })
    app.get('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result= await coffeCollection.findOne(query)
      res.send(result)
    })

    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee)
        const result= await coffeCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result= await coffeCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const coffee=req.body;
      const filter={_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateCoffee={
        $set:{
          name:coffee.name,
          chef:coffee.chef,
          supplier:coffee.supplier,
          taste:coffee.taste,
          category:coffee.category,
          details:coffee.details,
          photo:coffee.photo
        }
      }
      const result= await coffeCollection.updateOne(filter,updateCoffee,options)
      res.send(result)

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get((req,res)=>{
    res.send('coffee is running')

})

app.listen(port,()=>{
    console.log(`coffee is running on port : ${port}`)
})