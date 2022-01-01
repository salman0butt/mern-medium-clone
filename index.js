require('dotenv').config();
const connect = require("./config/db");
const bodyParser = require('body-parser')
const express = require("express");
const router = require("./routes/userRoutes");
const app = express();

//connect mongodb database
connect();

app.use(bodyParser.json());
app.use("/", router);
app.get('/', (req, res) => {
    res.send('Hello Mern Blog');
});
//TODO Start from lecture 7
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Your app is running ${PORT}`)
});