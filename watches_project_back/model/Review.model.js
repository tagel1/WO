const   { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const ReviewSchema = new Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;

