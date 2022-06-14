const express = require('express')
const app = express()
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors')

const { MongoClient, ServerApiVersion } = require('mongodb');

// console.log(process.env.DB_Pass);

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.tncmlce.mongodb.net/?retryWrites=true&w=majority`;
app.use(bodyParser.json());
app.use(cors())

const port = 5000;





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("newdb").collection("newproducts");
  const orderCollection = client.db("newdb").collection("orderProduct");

  app.post('/addProducts',(req,res)=>{
      products = req.body
      collection.insertMany(products)
      .then(result =>{
            console.log(result.insertedCount);
      })
  })


  app.get('/products',(req,res)=>{
      collection.find({})
      .toArray((err,document)=>{
            res.send(document)
      })
  })

  app.post('/productKeys', (req,res)=>{
    const productKey = req.body
    collection.find({id : {$in : productKey}})
    .toArray((err,document)=>{
      res.send(document)
    })
  })


  app.get('/product/:id',(req,res) =>{
      collection.find({id :req.params.id})
      .toArray((err,document)=>{
            res.send(document[0])
      })
  })


  app.post('/orderProducts',(req,res)=>{
    const order = req.body
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })



});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)