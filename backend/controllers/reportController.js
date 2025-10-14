const Report = require('../models/Report');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const { sendNewIssueMail, sendIssueResolvedMail } = require('../utils/mailer');

exports.createReport = async (req, res) => {
    try {
        const { title, description, category, priority, lat, lng, address } = req.body;
        const imageUrl = req.file?.path;
        const cloudinaryId = req.file?.filename;

        const newReport = await Report.create({
            title,
            description,
            category,
            priority,
            location: { lat, lng, address },
            reportedBy: req.user._id,
            imageUrl,
            cloudinaryId
        });

        const populatedReport = await Report.findById(newReport._id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email department');

        sendNewIssueMail(req.user.email, title, newReport._id.toString());

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ message: 'Server error while creating report' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const { issueId, location, category, status, sortBy, isHot, priority } = req.query;
        const query = {};

        if (issueId) {
            query._id = issueId;
        }
        if (category && category !== 'all') {
            query.category = category;
        }
        if (status && status !== 'all') {
            query.status = status;
        }
        if (priority && priority !== 'all') {
            query.priority = priority;
        }
        if (location) {
            query['location.address'] = { $regex: location, $options: 'i' };
        }
        if (isHot === 'true') {
            query.likes = { $gt: 0 };
        }

        let reportsQuery = Report.find(query)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email department');

        if (sortBy === 'likes') {
            reportsQuery = reportsQuery.sort({ likes: -1 });
        } else {
            reportsQuery = reportsQuery.sort({ createdAt: -1 });
        }

        const reports = await reportsQuery;
        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error fetching reports' });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email department');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Server error fetching report' });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        const { status, assignedTo, priority } = req.body;

        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (req.user.role === 'citizen') {
            return res.status(403).json({ message: 'Not authorized to update this report' });
        }

        if (status && status === 'Resolved' && report.status !== 'Resolved') {
            const reporter = await User.findById(report.reportedBy);
            if (reporter) {
                const feedbackLink = `${process.env.FRONTEND_URL}/report/${report._id}/feedback`;
                sendIssueResolvedMail(reporter.email, report.title, report._id.toString(), feedbackLink);
            }
        }

        report.status = status || report.status;
        report.assignedTo = assignedTo || report.assignedTo;
        report.priority = priority || report.priority;
        report.updatedAt = Date.now();

        const updatedReport = await report.save();
        const populatedReport = await Report.findById(updatedReport._id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email department');

        res.json(populatedReport);
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ message: 'Server error updating report' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text, isFeedback } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        const newComment = {
            text,
            author: req.user.name,
            isFeedback: isFeedback || false
        };

        report.comments.push(newComment);
        report.updatedAt = Date.now();
        await report.save();

        res.status(201).json(report.comments[report.comments.length - 1]);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        const userId = req.user._id.toString();
        const likedBy = report.likedBy || [];

        if (likedBy.includes(userId)) {
            report.likes = Math.max(0, report.likes - 1);
            report.likedBy = likedBy.filter(id => id !== userId);
            await report.save();
            res.json({ message: 'Unliked', likes: report.likes, liked: false });
        } else {
            report.likes += 1;
            report.likedBy.push(userId);
            await report.save();
            res.json({ message: 'Liked', likes: report.likes, liked: true });
        }
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ message: 'Server error toggling like' });
    }
};

exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reportedBy: req.user._id })
            .populate('assignedTo', 'name email department')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Get my reports error:', error);
        res.status(500).json({ message: 'Server error fetching reports' });
    }
};

exports.getAssignedReports = async (req, res) => {
    try {
        const reports = await Report.find({ assignedTo: req.user._id })
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Get assigned reports error:', error);
        res.status(500).json({ message: 'Server error fetching assigned reports' });
    }
};
