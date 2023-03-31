const { authenticate, isAdminAndLoggedIn, isUserAndLoggedIn } = require('../middleware');
const { createOrder, getOrder, getOrders, updateOrder, deleteOrder } = require('../controller/order.controller');

const express = require('express'), router = express.Router();



//  user routes
router.post('/user/login', require('../controller/user.controller').login);
router.post('/user/register', require('../controller/user.controller').register);
router.get('/user', authenticate, require('../controller/user.controller').getCurrentUser);
router.put('/user', authenticate, require('../controller/user.controller').updateUser);

router.post('/user/cart/:productId', authenticate, isUserAndLoggedIn, require('../controller/user.controller').addToCart);
router.delete('/user/cart/:productId', authenticate, isUserAndLoggedIn, require('../controller/user.controller').removeFromCart);
router.delete('/user/cart', authenticate, isUserAndLoggedIn, require('../controller/user.controller').clearCart);
router.post('/user/checkout', authenticate, isUserAndLoggedIn, require('../controller/user.controller').checkout);

// admin routes 
router.get('/admin/order/:id', authenticate, isAdminAndLoggedIn, require('../controller/admin.controller').getOrder);
router.post('/admin/products', authenticate, isAdminAndLoggedIn, require('../controller/admin.controller').createProduct);
router.put('/admin/products/:id', authenticate, isAdminAndLoggedIn, require('../controller/admin.controller').updateProduct);
router.delete('/admin/products/:id', authenticate, isAdminAndLoggedIn, require('../controller/admin.controller').deleteProduct);
router.get('/admin/orders', authenticate, isAdminAndLoggedIn, require('../controller/admin.controller').getOrders);

// product routes
router.get('/products', require('../controller/product.controller').getProducts);
router.get('/product/:id', require('../controller/product.controller').getProduct);
router.post('/product/review/:id', authenticate, isUserAndLoggedIn, require('../controller/product.controller').reviewProduct);
router.delete('/product/review/:productId/:id', authenticate, isUserAndLoggedIn, require('../controller/product.controller').deleteReview);
// order routes
router.post('/order', createOrder);
router.get('/order/:id', getOrder);
router.get('/order/', getOrders);
router.put('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);

module.exports = router;
