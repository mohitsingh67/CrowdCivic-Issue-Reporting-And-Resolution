const express = require('express');
const {
    createReport,
    getReports,
    getReportById,
    updateReport,
    addComment,
    toggleLike,
    getMyReports,
    getAssignedReports
} = require('../controllers/reportController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

const router = express.Router();

router.post('/', protect, upload.single('image'), createReport);
router.get('/', getReports);
router.get('/my-reports', protect, getMyReports);
router.get('/assigned', protect, staffOrAdmin, getAssignedReports);
router.get('/:id', getReportById);
router.put('/:id', protect, staffOrAdmin, updateReport);
router.post('/:id/comment', protect, addComment);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
