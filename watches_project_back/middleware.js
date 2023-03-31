

const jwt = require('jsonwebtoken');
const UserModel = require('./model/User.model');

const authenticate = (req, res, next) => {
    // get the token from the request headers
    let token = req.headers.authorization ?? req.headers['authorization'] ?? req.headers['Authorization'];
    // check if the token exists
    if (token) {
        token = (token.split('Bearer ')[1] ?? "").replaceAll("\"","");
        // if the token exists, verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

            // check if there is an error
            if (err) {
                console.log("Error decoding the token:")

                // if there is an error, send a 401 status code
                res.status(401).send('you are not logged in');
            } else {
                // if there is no error, set the user to the decoded token
                req.user = await UserModel.findById(decodedToken.id).populate([
                    {
                        path: 'cart',
                        model: 'Cart',
                        populate: {
                            path: 'products.product',
                            model: 'Product'
                        }
                    },
                    {
                        path: 'orders',
                        populate: {
                            path: 'cart',
                            model: 'Cart',
                            populate: {
                                path: 'products.product',
                                model: 'Product'
                            }
                        }
                    },
                    {
                        path:'reviews',
                        model:'Review'
                    }
                ]);
                // continue to the next middleware
                next();
            }
        });
    } else {
        // if the token does not exist, send a 401 status code
        res.status(401).send('you are not logged in');
    }
}

const generateToken = (user) => {
    // create a token for the user
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // return the token
    return token;
}



// middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    // check if the user is an admin
    if (req.user.role === 'admin') {
        // if the user is an admin, continue to the next middleware
        next();
    } else {
        // if the user is not an admin, send a 401 status code
        res.status(401).send('you are not an admin');
    }
}

// middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    // check if the user is logged in
    if (req.user) {
        // if the user is logged in, continue to the next middleware
        next();
    } else {
        // if the user is not logged in, send a 401 status code
        res.status(401).send('you are not logged in');
    }
}

// middleware to check if the user is logged in and is an admin
const isAdminAndLoggedIn = (req, res, next) => {
    // check if the user is logged in and is an admin
    if (req.user && req.user.role === 'admin') {
        // if the user is logged in and is an admin, continue to the next middleware
        next();
    } else {
        // if the user is not logged in or is not an admin, send a 401 status code
        res.status(401).send('you are not an admin');
    }
}

// middleware to check if the user is logged in and is a user
const isUserAndLoggedIn = (req, res, next) => {
    // check if the user is logged in and is a user
    if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
        // if the user is logged in and is a user, continue to the next middleware
        next();
    } else {
        // if the user is not logged in or is not a user, send a 401 status code
        res.status(401).send('you are not a user');
    }
}

const comparePassword = async function (user, password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, user.password);
};



module.exports = { authenticate, generateToken, isAdmin, isLoggedIn, isAdminAndLoggedIn, isUserAndLoggedIn, comparePassword };

