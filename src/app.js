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
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.static(path.join(__dirname, "views")));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

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
        maxAge: 60000 * 60 * 24
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