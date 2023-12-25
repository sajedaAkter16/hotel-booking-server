const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()
// var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const port = process.env.PORT ||5000

// middleware
app.use(express.json())
// app.use(cookieParser())
app.use(cors(
  // {
  // origin:[
  //   // 'http://localhost:5173',
  //   // 'https://assaignment-category-0004.web.app',
  //   // 'https://assaignment-category-0004.firebaseapp.com'
  
  
  // ],
  // credentials:true
// }
))



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


// middleware for jwt
// const verifyToken=(req,res,next)=>{
//   const token=req.cookies.token
//   console.log(token)
//   if(!token){
//    return res.status(401).send({message:'unauthorized access'})
//   }
//   jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
//     if(err){
//      return res.status(401).send({message:'Not authorized'})
//     }
//     req.user=decoded;
//     next()

// })
// }
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const roomsCollection=client.db('hotel_booking_DB').collection('rooms')
    const bookingCollection=client.db('hotel_booking_DB').collection('booking')
    const reviewsCollection=client.db('hotel_booking_DB').collection('reviews')


    // auth related
    // app.post('/jwt',async(req,res)=>{
    //   const user=req.body;
    //   const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
    //   console.log(token)
    //   res
    //   .cookie('token',token,{
    //     httpOnly:true,
    //     secure:true,
    //     sameSite:"none"
    //   })
    //   .send({suceess:true})
    // })
    // get all the rooms info
    app.get('/rooms',async(req,res)=>{
      // const price=req.query.price
      const query={}
      const options={
        sort:{"price":-1}
      }
    
      // console.log(query)
      const result=await roomsCollection.find(query,options).toArray()
      res.send(result)
    })

    // spesific data by id
    app.get('/rooms/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await roomsCollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    // all the booking insert
    app.post('/booking',async(req,res)=>{
      const query=req.body;
      const result=await bookingCollection.insertOne(query)
      res.send(result)
    })
    
    // get booking data by specific email
    app.get('/booking',async(req,res)=>{
      const email=req.query.email;
    //  if(email !==req.user.email){
    //   return res.status(403).send({message:"Forbbiden access"})
    //  }
     
      let query={}
      if(email){
        query={email:email}
      }
      const result=await bookingCollection.find(query).toArray()
      res.send(result)
    })

    // delete specific data by using id
    app.delete('/booking/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const deleteBooked=await bookingCollection.deleteOne(query)
      res.send(deleteBooked)

    })

app.get('/booking/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await bookingCollection.find(query).toArray()
  res.send(result)
})
    // update booking date
    app.patch('/booking/:id',async(req,res)=>{

      const filter={_id:new ObjectId(req.params.id)}
      const updateBooking=req.body
      const updateBook={
        $set:{
          date:updateBooking.date
        }
      }
      const result=await bookingCollection.updateOne(filter,updateBook)
      res.send(result)
    })
    // create api for reviews
    app.post('/reviews',async(req,res)=>{
          const query=req.body
          const reviews=await reviewsCollection.insertOne(query)
          console.log(reviews)
          res.send(reviews)
    })

    // get the review data
    app.get('/reviews',async(req,res)=>{
      const query={}
      const reviewaAll=await reviewsCollection.find(query).toArray()
      res.send(reviewaAll)
    })
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