const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, userValidation } = require('../middleware/validation');
const {
    register,
    login,
    getMe,
    updateProfile
} = require('../controllers/authController');

router.post('/register', validate(userValidation.register), register);
router.post('/login', validate(userValidation.login), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;