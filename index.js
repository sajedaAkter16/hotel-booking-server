const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()
const port = process.env.PORT ||5000

// middleware
app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvo4nkj.mongodb.net/?retryWrites=true&w=majority`;


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

    const roomsCollection=client.db('hotel_booking_DB').collection('rooms')


    // get all the rooms info
    app.get('/rooms',async(req,res)=>{
      const result=await roomsCollection.find().toArray()
      res.send(result)
    })

    // spesific data by id
    app.get('/rooms/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await roomsCollection.findOne(query)
    
      res.send(result)
    })
    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('assaignment_category_0004')
})

app.listen(port, () => {
  console.log(`Hotel_Booking app listening on port ${port}`)
})