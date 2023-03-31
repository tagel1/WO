

// order controller

const Order = require('../model/Order.model');

// create order

const createOrder = async (req, res) => {
    if (req.body) {
        const order = new Order(req.body);
        order.save()
            .then(data => {
                res.status(200).send({ data: data });
            })
            .catch(error => {
                res.status(500).send({ error: error.message });
            });
    }
}

// get order

const getOrder = async (req, res) => {
    if (req.params && req.params.id) {
        await Order.findById(req.params.id)
            .then(data => {
                res.status(200).send({ data: data });
            })
            .catch(error => {
                res.status(500).send({ error: error.message });
            });
    }
}

// get orders

const getOrders = async (req, res) => {
    await Order.find({})
        .then(data => {
            res.status(200).send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
}

// update order

const updateOrder = async (req, res) => {

    if (req.params && req.params.id) {
        const { id } = req.params;
        const order = req.body;
        const updateOrder = { $set: order };
        const options = { new: true };

        await Order.findByIdAndUpdate(id, updateOrder, options)
            .then(data => {
                res.status(200).send({ data: data });
            })
            .catch(error => {
                res.status(500).send({ error: error.message });
            });
    }
}


// delete order

const deleteOrder = async (req, res) => {

    if (req.params && req.params.id) {
        await Order.findByIdAndDelete(req.params.id)
            .then(data => {
                res.status(200).send({ data: data });
            })
            .catch(error => {
                res.status(500).send({ error: error.message });
            });
    }
}

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    updateOrder,
    deleteOrder
}
