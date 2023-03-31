
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    gender: {
        type: String,
        required: true
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;