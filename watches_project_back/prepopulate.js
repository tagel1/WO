

// here we prepopulate the database with some data
// watches and products from some brands

const Product = require('./model/Product.model.js');
const User = require('./model/User.model.js');
const CartModel = require('./model/Cart.model');
const bcrypt = require('bcrypt');
const OrderModel = require('./model/Order.model.js');
exports.prepopulate = async () => {

    // delete all first
    // await Product.deleteMany({});
    await User.deleteMany({});
    await CartModel.deleteMany({});
    // await OrderModel.deleteMany({});

    // create some users and products

    const saltRounds = 10;

    const admin = new User({
        email: 'tagel@walla.com',
        password: await bcrypt.hash('admin', saltRounds),
        name: 'admin',
        role: 'admin',
    });

    /*const user = new User({
        email: 'avi@walla.com',
        password: await bcrypt.hash('user', saltRounds),
        name: 'user',
        role: 'user'
    });*/

    const cart = new CartModel({ user: admin._id, products: [], completed: false });
    admin.cart = cart._id;
    // cart.user = admin._id;
    //await user.save();
    await cart.save();
    await admin.save();

    /*const products = [
        {
            name: 'Rolex Submariner',
            price: 10000,
            image: 'https://www.rolex.com/content/dam/watches/submariner/126610lv-0001.pngxssxC',
            description: 'Rolex Submariner 126610LV',
            category: 'Rolex',
            gender: "male"
        },
        {
            name: 'Rolex GMT Master II',
            price: 12000,
            image: 'https://www.rolex.com/content/dam/watches/gmt-master-ii/126710blro-0001.pngxssxC',
            description: 'Rolex GMT Master II 126710BLRO',
            category: 'Rolex',
            gender: "male"
        },
        {
            name: 'Rolex Daytona',
            price: 15000,
            image: 'https://www.rolex.com/content/dam/watches/daytona/116500ln-0001.pngxssxC',
            description: 'Rolex Daytona 116500LN',
            category: 'Rolex',
            gender: "male"
        },
        {
            name: 'Rolex Explorer',
            price: 8000,
            image: 'https://www.rolex.com/content/dam/watches/explorer/214270-0001.pngxssxC',
            description: 'Rolex Explorer 214270',
            category: 'Rolex',
            gender: "female"
        },
        {
            name: 'Rolex Datejust',
            price: 7000,
            image: 'https://www.rolex.com/content/dam/watches/datejust/126334-0001.pngxssxC',
            description: 'Rolex Datejust 126334',
            category: 'Rolex',
            gender: "female"
        },
        {
            name: 'Rolex Yacht-Master',
            price: 13000,
            image: 'https://www.rolex.com/content/dam/watches/yacht-master/116655-0001.pngxssxC',
            description: 'Rolex Yacht-Master 116655',
            category: 'Rolex',
            gender: "female"
        },
        {
            name: 'Rolex Milgauss',
            price: 9000,
            image: 'https://www.rolex.com/content/dam/watches/milgauss/116400gv-0001.pngxssxC',
            description: 'Rolex Milgauss 116400GV',
            category: 'Rolex',
            gender: "female"
        },
        {
            name: 'Rolex Sea-Dweller',
            price: 11000,
            image: 'https://www.rolex.com/content/dam/watches/sea-dweller/126600-0001.pngxssxC',
            description: 'Rolex Sea-Dweller 126600',
            category: 'Rolex',
            gender: "male"
        },
        {
            name: 'Rolex Air-King',
            price: 6000,
            image: 'https://www.rolex.com/content/dam/watches/air-king/116900-0001.pngxssxC',
            description: 'Rolex Air-King 116900',
            category: 'Rolex',
            gender: "female"
        },
        {
            name: 'Rolex Oyster Perpetual',
            price: 5000,
            image: 'https://www.rolex.com/content/dam/watches/oyster-perpetual/114300-0001.pngxssxC',
            description: 'Rolex Oyster Perpetual 114300',
            category: 'Rolex',
            gender: "male"
        },
        {
            name: 'Omega Seamaster',
            price: 8000,
            image: 'https://www.omegawatches.com/content/dam/watches/seamaster/omega-seamaster-300-m-212-30-41-20-04-001-1.pngxssxC',
            description: 'Omega Seamaster',
            category: 'Omega',
            gender: "female"
        },
        {
            name: 'Omega Speedmaster',
            price: 9000,
            image: 'https://www.omegawatches.com/content/dam/watches/speedmaster/omega-speedmaster-omega-moonwatch-311-30-42-30-01-001-1.pngxssxC',
            description: 'Omega Speedmaster',
            category: 'Omega',
            gender: "male"
        },
        {
            name: 'Omega Constellation',
            price: 7000,
            image: 'https://www.omegawatches.com/content/dam/watches/constellation/omega-constellation-123-10-38-20-03-001-1.pngxssxC',
            description: 'Omega Constellation',
            category: 'Omega',
            gender: "male"
        }];
    try {

        await Product.insertMany(products)
            .then(async (inserted) => {
                inserted = inserted.slice(0, 4).map(x => ({ product: x._id, quantity: 1 }))
                cart.products = inserted;
                await cart.save();
                const order = await new OrderModel({
                    orderDate: new Date(),
                    orderTotal: 1000,
                    orderStatus: 'pending',
                    user: admin._id,
                    address: 'Tel Aviv',
                    cart: cart._id,
                    lastCardFourDigits: '1234',
                }).save();
                admin.orders.push(order._id);
                console.log(`Created ${products.length} products ` + ` and 2 users`);
            })
        await admin.save();
    } catch (err) {
        console.log(err)
    }*/
}