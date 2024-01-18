require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require("cors")
const loginRoute = require("./Routes/loginRoute")
const profileRoute = require("./Routes/profileRoute")



const app = express()

app.use(cors());
//middleware

app.use(express.json())

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users',loginRoute)

app.use('/api/profile',profileRoute)


mongoose.connect(process.env.MONGO_URI,{
    dbName:"productone",
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=>{
        app.listen(process.env.PORT,() => {
            console.log('Database connected and Server Started!',process.env.PORT);
        })
    })
    .catch((error)=>{
        console.log(error)
    })

