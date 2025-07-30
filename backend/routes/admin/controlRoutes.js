const express = require('express');
const { adminAuthenticate } = require('../../middleware/adminMiddleware');
const { 
    getUser, 
    getSeller, 
    NewSellerRequest, 
    verifySeller, 
    rejectSeller,
    deleteSeller,
    deleteUser 
} = require('../../controllers/admin/headQuarter');


const router = express.Router();

router.post('/get-users', adminAuthenticate, getUser)
router.post('/get-sellers',adminAuthenticate, getSeller)
router.post('/get-newRequest', adminAuthenticate, NewSellerRequest)
router.post('/verify-seller/:sellerId',adminAuthenticate, verifySeller)
router.post('/reject-seller/:sellerId',adminAuthenticate, rejectSeller)
router.post('/delete-seller/:sellerId', adminAuthenticate, deleteSeller)
router.post('/delete-user/:userId', adminAuthenticate, deleteUser)




module.exports = router