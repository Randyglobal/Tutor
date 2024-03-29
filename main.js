// Imports

require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// const client = require('mongodb').MongoClient

const session = require('express-session')



// calling the port in the .env
const PORT  = process.env.PORT || 4000

const DB_CONNECT = process.env.database_URL;

const app = express();


// database connect
mongoose.connect(DB_CONNECT, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

let db = mongoose.connection;

db.on("error", (err) => console.log(err));

db.once('open', () => console.log("DB CONNECTED!"));

// End




// setting middle wares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
        secret: "My secret key",
        saveUninitialized: true,
        resave: false
    })
)

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// const uploads = require('./public/uploads')
// app.use(express.static("uploads"))


// setting template engine
app.set('view engine', 'ejs')

// Route prefix
const route = require('./router/router')

app.use("/", route)

// listening to our app on http://localhost:5000
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
}) 