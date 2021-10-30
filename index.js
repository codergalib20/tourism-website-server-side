const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Middle Ware__
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpacy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run () {
      try{
          await client.connect();
          console.log('Connect to database')
          const database = client.db('tour-travel');
          const serviceCollection = database.collection('services');
          const orderServiceCollection = database.collection('addOrders')

          // GET API SERVICES DATA__
          app.get('/services', async(req, res)=> {
              const cursor = serviceCollection.find({});
              const services = await cursor.toArray();
              res.send(services)
          })
          app.get('/addOrders', async(req, res)=> {
              const cursor = orderServiceCollection.find({});
              const orderService = await cursor.toArray();
              res.send(orderService)
          })
          // GET API EVERY SINGLE SERVICE of SERVICES __
          app.get('/services/:id', async(req, res)=> {
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const service = await serviceCollection.findOne(query);
              res.send(service);
          })
          // POST API SERVICES DATA__
          app.post('/services', async(req, res)=> {
              const service = req.body;
              const result = await serviceCollection.insertOne(service);
              res.json(result);
              
          })

          // Add ORDER SERVICE POST
          app.post('/addOrders', async (req, res)=> {
              const order = req.body;
             const result = await orderServiceCollection.insertOne(order);
             res.json(result);
          })

        //   Delete Order Service 
        app.delete('/addOrders/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderServiceCollection.deleteOne(query);
            res.json(result);
        })

        // Update Order Services
        app.put('/addOrders/:id', async (req , res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const option = {upset: true};
            const updateDoc = {
                $set : {
                    status : 'Approved'
                },
            };
            const result = await orderServiceCollection.updateOne(query, updateDoc, option)
            res.json(result)
        })
      }
      finally{
        //   await client.close()
      }
}
run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('Travel Server is running')
})
app.listen(port, () => {
    console.log('Running Travel Tour Server port ', port);
})