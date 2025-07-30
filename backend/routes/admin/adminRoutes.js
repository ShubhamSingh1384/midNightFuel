const express = require('express');
const { loginAdmin } = require('../../controllers/admin/adminController');

const router = express.Router();

router.post('/login', loginAdmin)
// router.post('/signup', signupAdmin)



module.exports = router