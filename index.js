const express = require('express');
var cors = require('cors');
var app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://ayon008:shariar5175@cluster0.mptmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        const dataBase = client.db('uicc');
        const usersCollection = dataBase.collection('users');
        const visitor = dataBase.collection('visitor');
        const subscribeEmail = dataBase.collection('email');

        app.post('/visitor', async (req, res) => {
            console.log('clicked');
            const data = req.body;
            const updateData = {
                $inc: { visitorCount: data?.visitorCount }
            }
            const updateResult = await visitor.updateOne({ _id: new ObjectId('676ffef49d4da3fc1becc71c') }, updateData);
            res.send(updateResult);
        })

        app.get('/visitors', async (req, res) => {
            const visitors = await visitor.findOne({ _id: new ObjectId('676ffef49d4da3fc1becc71c') }, { projection: { _id: 0, visitorCount: 1 } });
            console.log(visitors);
            res.send(visitors);
        })


        app.post('/user', async (req, res) => {
            const data = req.body;
            const query = data.uid;
            const findOne = await usersCollection.findOne({ uid: { $eq: query } });
            console.log(findOne);
            if (!findOne) {
                const result = await usersCollection.insertOne(data);
                res.send(result);
            }
        })

        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray();
            const userCount = users?.length;
            res.send({ userCount });
        })


        app.post('/email', async (req, res) => {
            const email = req.body;
            const findOne = await subscribeEmail.findOne({ email: { $eq: req.body.email } });
            console.log(findOne, email, 'clicked');
            if (!findOne) {
                const result = await subscribeEmail.insertOne(email);
                res.send(result);
            }
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})