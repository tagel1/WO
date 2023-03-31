
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { prepopulate } = require('./prepopulate');
dotenv.config();
const connectionString = `mongodb+srv://aviran:${process.env.MONGO_PASS}@cluster0.stax15f.mongodb.net/?retryWrites=true&w=majority`

const connectDB = (callback) => {
    try {
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
        });
        prepopulate();
        callback();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { connectDB };