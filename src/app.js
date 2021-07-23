require("dotenv").config();
require("./strategies/discord");

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");
const Store = require("connect-mongo").default;

const app = express();
const PORT = process.env.PORT || 5001;
const routes = require("./routes");

app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

app.use(session({
    secret: "x#kS{zY!pPLK.>2$iD99VzKo<*}cs@",
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    store: Store.create({ 
        mongoUrl: process.env.MONGO_DB_URL,
        autoDelete: 'native'
     })
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});