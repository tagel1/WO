const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./database');
dotenv.config();

/* 
    // we are creating a shop with admins and users
    // the shop is a watch shop, we will have 2 roles, admin and user
    // the users can make orders and the admins can add watches to the shop
    // and do all crud operations on the watches and inspect orders

    // we will use express to create our server
    // mongoose to connect to our database
    // jsonwebtoken to create tokens for our users
    // bcrypt to hash our passwords
    // cors to allow cross origin requests
    // dotenv to store our environment variables
*/

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({
    limit: '50mb',
    extended: true
}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));



connectDB(() => {
    console.log('connected to database');
});

app.use('/api', require('./routes'));

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})
