const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lastCardFourDigits: {
        type: String,
        required: true
    },
});


const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;