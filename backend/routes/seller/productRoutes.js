const express = require('express');
const { addProduct, editProduct ,fetchProduct,deleteProduct, fetchAllProduct ,allorders, updateOrderStatus} = require('../../controllers/seller/productController');
const { authentication } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/get-products',authentication, fetchProduct)
router.get('/get-orders', authentication,allorders)
router.get('/get-allproducts', fetchAllProduct);
router.post('/add',authentication, addProduct);
router.put('/edit/:productId', editProduct);
router.put('/update-order/:id', updateOrderStatus);
router.delete('/delete/:productId', deleteProduct)



module.exports = router;

