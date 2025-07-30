const express = require('express');
const passport = require('passport');

const { 
    loginSeller, 
    generateOTP_SignupSeller, 
    logoutSeller, 
    resetPassword, 
    verifyOTP_SignupSeller, 
    googleCallback, 
    getUser
} = require('../../controllers/seller/sellerController');

const router = express.Router();

router.post('/login',loginSeller)
router.post('/generate-otp', generateOTP_SignupSeller)
router.post('/signup',verifyOTP_SignupSeller)
router.get('/logout', logoutSeller)
router.post('/reset-password', resetPassword)

router.get('/auth/google',
    passport.authenticate('google', {scope:['profile', 'email']})
)

router.get('/auth/google/callback', 
    passport.authenticate('google', {session:false}), 
    googleCallback
)

router.post('/google-verification', 
    passport.authenticate('jwt', {session: false}),
    getUser
)


module.exports = router;