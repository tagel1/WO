const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    phone: {
        type: String,
        required: false
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
});


const UserModel = mongoose.model('User', UserSchema);




// hash the password before saving
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
        return
    }

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});



module.exports = UserModel;

