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

app.use(cors({
    origin: "*"
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

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
        maxAge: 60000 * 60 * 24 * 7
    },
    resave: false,
    saveUninitialized: false,
    store: Store.create({ 
        mongoUrl: process.env.MONGO_DB_URL,
        autoDelete: 'native'
     })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});