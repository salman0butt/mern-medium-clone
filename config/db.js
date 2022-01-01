require('dotenv').config();
const mongoose = require("mongoose");

const connect = async () => {
    try {
        const response = await mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = connect;