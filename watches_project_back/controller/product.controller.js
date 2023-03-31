
// product query controller
const Product = require("../model/Product.model");
const ReviewModel = require("../model/Review.model");
const UserModel = require("../model/User.model");
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate({
            path: 'reviews',
            model: 'Review',
            populate: {// populate only the name of the reviewer
                path: 'reviewer',
                model: 'User',
                select: ['name', '_id']
            }
        });
        // partition by category
        const categories = products.reduce((acc, product) => {
            if (!acc[product.category])
                acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
}


exports.reviewProduct = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const productX = await Product.findById(req.params.id).populate({
            path: 'reviews',
            model: 'Review',
            populate: {// populate only the name of the reviewer
                path: 'reviewer',
                model: 'User',
                select: 'name'
            }
        });
        const user = await UserModel.findById(req.user._id);
        if (productX.reviews.find(review => review.reviewer == req.user._id)) {
            res.status(400).json({ message: 'כבר דרגת את המוצר הזה' });
            return;
        }
        const review = {
            reviewer: req.user._id,
            product: comment.product,
            comment: comment.review
        }
        const newReview = await ReviewModel.create(review);
        productX.reviews.push(newReview._id);
        await productX.save();
        user.reviews.push(newReview._id);
        await user.save();
        res.status(200).json(newReview);
        console.log(newReview)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await ReviewModel.findById(req.params.id);
        const product = await Product.findById(req.params.productId).populate({
            path: 'reviews',
            model: 'Review',
            populate: {// populate only the name of the reviewer
                path: 'reviewer',
                model: 'User',
                select: 'name'
            }
        });
        const user = await UserModel.findById(review.reviewer);
        user.reviews = user.reviews.filter((review) => review._id != req.params.reviewId);
        product.reviews = product.reviews.filter((review) => review._id != req.params.reviewId);
        await user.save();
        await product.save();
        await review.remove();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
}



// get a single product
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'reviews',
                model: 'Review',
                populate: {// populate only the name of the reviewer    
                    path: 'reviewer',
                    model: 'User',
                    select: ['name', '_id']
                }
            });

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
}
