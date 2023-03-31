const mongoose = require('mongoose');

const { Schema } = mongoose;

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const CartModel = mongoose.model('Cart', CartSchema);
// virtual property
CartSchema.virtual('totalPrice').get(function () {
    return this.products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
    }, 0);
});

module.exports = CartModel;