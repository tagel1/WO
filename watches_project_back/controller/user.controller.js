const { generateToken, comparePassword } = require('../middleware');
const User = require('../model/User.model.js');
const Cart = require('../model/Cart.model.js');
const OrderModel = require('../model/Order.model');
const ProductModel = require('../model/Product.model');
// this is user controller
// we will set registration, login
// register
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    // check exists
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(401).json('משתמש עם אימייל זה כבר קיים במערכת');
    }
    const user = await User.create({ email, password, name });
    const cart = await Cart.create({
        user: user._id,
        products: [],
        completed: false
    });
    user.cart = cart._id;
    // create a token for the user
    const token = generateToken(user);
    await user.save();
    // send the token to the user
    res.status(201).json(token);
}

exports.addToCart = async (req, res) => {
    const { quantity } = req.body;
    const user = req.user;
    let cart = await Cart.findById(user.cart._id)
    const product = cart.products.find((p) => p.product == req.params.productId);
    if (product) {
        product.quantity += quantity;
    } else {
        cart.products.push({ product: req.params.productId, quantity: quantity ?? 1 });
    }
    cart = await cart.save();
    cart = await cart.
        populate({
            path: 'products.product',
            model: 'Product'
        });
    res.status(200).json(cart);
}

exports.updateUser = async (req, res) => {
    const user = req.body;
    if (!user) {
        return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    const u = await User.findById(user._id).populate([{
        path: 'cart',
        model: 'Cart',
        populate: {
            path: 'products.product',
            model: 'Product'
        },
    }, {
        path: 'orders',
        model: 'Order',
        populate: {
            path: 'cart',
            model: 'Cart',
            populate: {
                path: 'products.product',
                model: 'Product'
            },
        }
    }
    ]);
    if (user.name) {
        u.name = user.name;
    }
    if (user.address) {
        u.address = user.address;
    }
    if (user.phone) {
        u.phone = user.phone;
    }
    if (user.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        u.password = await bcrypt.hash(user.password, saltRounds);
    }
    await u.save();
    res.status(200).json(u);
}


exports.clearCart = async (req, res) => {
    const user = req.user;
    let cart = await Cart.findById(user.cart._id);
    cart.products = [];
    cart = await cart.save();
    res.status(200).json(cart);
}


exports.removeFromCart = async (req, res) => {
    const user = req.user;
    let cart = await Cart.findById(user.cart._id).populate(
        {
            path: 'products.product',
            model: 'Product'
        }
    );
    const product = cart.products.find((p) => p.product._id == req.params.productId);
    if (product) {
        product.quantity -= 1;
        if (product.quantity <= 0) {
            console.log('remove product')
            cart.products = cart.products.filter((p) => p.product._id != req.params.productId);
        } else {
            console.log('update product')
            cart.products = cart.products.map((p) => {
                if (p.product._id == req.params.productId) {
                    return product;
                }
                return p;
            });
        }
    }
    cart = await cart.save();
    res.status(200).json(cart);
}


exports.checkout = async (req, res) => {
    const user = req.user;
    const { address, lastCardFourDigits } = req.body;
    if (!address || !lastCardFourDigits) {
        return res.status(400).json({ message: 'address and lastCardFourDigits are required' });
    }
    const cart = await Cart.findById(user.cart._id);
    cart.completed = true;
    cart.products = cart.products.filter(async (p) => (await ProductModel.findById(p.product)) != null);
    await cart.save();
    const order = await OrderModel.create({
        user: user._id,
        cart: cart._id,
        address,
        lastCardFourDigits
    });
    const userModel = await User.findById(user._id);
    userModel.cart = await Cart.create({
        user: user._id,
        products: [],
        completed: false
    });
    userModel.cart = userModel.cart._id;
    if (!userModel.orders) {
        userModel.orders = [];
    }
    userModel.orders.push(order._id);
    await userModel.save()
    const newUser = await User.findById(user._id).populate([{
        path: 'cart',
        model: 'Cart',
        populate: {
            path: 'products.product',
            model: 'Product'
        },
    }, {
        path: 'orders',
        model: 'Order',
        populate: {
            path: 'cart',
            model: 'Cart',
            populate: {
                path: 'products.product',
                model: 'Product'
            },
        }
    }
    ])
    res.status(200).json(newUser);
}





// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    // find the user by email
    const user = await User.findOne({ email });
    // if the user does not exist, send a 401 status code
    if (!user) {
        return res.status(401).send('סיסמא או דוא"ל לא נכונים');
    }
    // if the user exists, check if the password is correct
    const isPasswordCorrect = await comparePassword(user, password);
    // if the password is not correct, send a 401 status code
    if (!isPasswordCorrect) {
        return res.status(401).send('סיסמא או דוא"ל לא נכונים');
    }
    // if the password is correct, create a token for the user
    const token = generateToken(user);
    // send the token to the user
    res.status(200).json(token);

}

// get the current user
exports.getCurrentUser = async (req, res) => {
    // get the user from the request
    let user = req.user;
    // send the user to the user
    res.status(200).json({ user });
}


