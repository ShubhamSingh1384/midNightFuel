const express = require('express');
const { userSignup, userLogin } = require('../../controllers/user/userController');

const router = express.Router();

router.post('/login',userLogin);
router.post('/signup',userSignup);

module.exports=router