const express = require('express');
const { addToCart, removeCartItems, updateCartItems, getUserCart, orderplaced,orders, onlineOrderPlaced , verifyStripe } = require('../../controllers/user/userProductController');
const { authClientMiddleware } = require('../../middleware/authClientMiddleware');
const router = express.Router();

router.post('/addToCart',authClientMiddleware,addToCart);
router.delete('/removeCartItems',authClientMiddleware,removeCartItems);
router.put('/updateCartItems',authClientMiddleware,updateCartItems);
router.get('/getUserCart',authClientMiddleware,getUserCart);
router.post('/orderplaced',authClientMiddleware,orderplaced);
router.post('/orderplaced/online',authClientMiddleware,onlineOrderPlaced);
router.post('/verifyStripe',authClientMiddleware,verifyStripe);
router.get('/orders',authClientMiddleware,orders);


module.exports = router;
