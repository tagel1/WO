

const Order = require('../model/Order.model');
const Product = require('../model/Product.model');
const ReviewModel = require('../model/Review.model');
const UserModel = require('../model/User.model');


// create a product
exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            category: req.body.category,
            gender: req.body.gender,
            reviews: []
        });
        const prod = await product.save();
        return res.status(201).json(prod);
    } catch (err) {
        res.status(500).json(err);
    }
}


// update a product

exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const productUpdate = req.body
        const product = await Product.findById(id).populate('reviews');
        await product.updateOne(productUpdate);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
}



// delete a product

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id

    try {
        await Product.findByIdAndDelete(id);
        await Order.updateMany({}, { $pull: { cart: { product: id } } });
        // delete all related user reviews
        await UserModel.updateMany({}, { $pull: { reviews: { product: id } } });
        await ReviewModel.deleteMany({ product: id });
        //  delete all related product reviews
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
}

// get all orders

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate({
            path: 'cart',
            strictPopulate: false,
            model: 'Cart',
            populate: {
                path: 'products',
                strictPopulate: false,
                populate: {
                    path: 'product',
                    strictPopulate: false,
                    model: 'Product'
                }
            }
        }).populate({
            path: 'user',
            model: 'User',
            strictPopulate: false
        });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
}

// get a single order

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
}
