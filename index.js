const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const getRouter = require('./routes/get')
const postRouter = require('./routes/post')
const elimit = require('express-rate-limit')
const rahatupu_bot = require('./bot/rtbot/bot')
var cors = require('cors')
const { saveWordToDatabase } = require('./routes/fns/englishclub-scrap')

const app = express()

// database connection
mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/mikeka-ya-uhakika?authSource=admin&replicaSet=atlas-pyxyme-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`)
    .then(() => console.log('Connected to ya Uhakika Database'))
    .catch((err) => {
        console.log(err)
    })

const limiter = elimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "To many request, please try again after 3 minutes"
})

// MIDDLEWARES
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('trust proxy', true) //our app is hosted on server using proxy to pass user request
//attach webhook
if (process.env.environment == 'production') {
    rahatupu_bot.rtBot(app)
}
app.use(cors())
app.use(limiter)
app.use(postRouter)
app.use(getRouter)

//attach polling
if (process.env.environment == 'production') {
    //
}

//set interval to update the english club database
setInterval(() => {
    const now = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' });
    const [h, m, s] = now.split(':').map(Number);

    if (h === 9 && process.env.environment !== 'local') {
        if (m === 0) saveWordToDatabase('idiom');
        if (m === 5) saveWordToDatabase('phrase');
        if (m === 10) saveWordToDatabase('slang');
    }
}, 60000);


app.listen(process.env.PORT || 3000, () => console.log('Running on port 3000'))

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason)
    //on production here process will change from crash to start cools
})

//caught any exception
process.on('uncaughtException', (err) => {
    console.log(err)
})