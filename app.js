/* =======================

    LOAD THE DEPENDENCIES

========================= */

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')


/* =======================

    LOAD THE DEPENDENCIES

========================= */

const config = require('./config')
const port = process.env.PORT || 3000

/* =======================

    EXPRESS CONFIGURATION

========================= */

const app = express();

//parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//print the request log on console
app.use(morgan('dev'))

//set views
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'pug');

//set the secret key valiable for jwt
app.set('jwt-secret',config.secret)

//index page, just for testing
app.get('/', (req,res) => {
    res.send('Hello JWT')
})

// configure api router
app.use('/api', require('./routes/api'))

//open the server
app.listen(port, () => {
    console.log(`Express is running on port  ${port}`)
})

/* =======================

    CONFIG TO MONGODB SERVER

========================= */

mongoose.connect(config.mongodbUri, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=> {
    console.log('connected to mongodb server')
})
