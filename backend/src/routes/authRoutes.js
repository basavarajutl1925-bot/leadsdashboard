const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAuthToken, adminOnly } = require('../middleware/authMiddleware');

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Verify Token
router.get('/verify', authController.verifyToken);

// Get current user profile
router.get('/me', verifyAuthToken, authController.getCurrentUser);

// Change password
router.post('/change-password', verifyAuthToken, authController.changePassword);

// User management (admin only)
router.get('/users', verifyAuthToken, adminOnly, authController.getAllUsers);
router.post('/users', verifyAuthToken, adminOnly, authController.createUser);
router.put('/users/:userId', verifyAuthToken, adminOnly, authController.updateUser);
router.delete('/users/:userId', verifyAuthToken, adminOnly, authController.deleteUser);

module.exports = router;
