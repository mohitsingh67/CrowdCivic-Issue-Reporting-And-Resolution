const express = require('express');
const {
    registerUser,
    loginUser,
    getUsersForApproval,
    approveUser,
    getAllStaff
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/unapproved', protect, admin, getUsersForApproval);
router.put('/:id/approve', protect, admin, approveUser);
router.get('/staff', protect, admin, getAllStaff);

module.exports = router;
