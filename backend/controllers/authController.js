const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendRegistrationApprovalMail } = require('../utils/mailer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let isApproved = role === 'citizen';
        if (role === 'admin' || role === 'staff') {
            const existingStaffOrAdmin = await User.countDocuments({ role: { $in: ['admin', 'staff'] } });
            if (existingStaffOrAdmin === 0) {
                isApproved = true;
            }
        }

        const user = await User.create({ name, email, password, role, department, isApproved });

        sendRegistrationApprovalMail(email, name, isApproved);

        if (user) {
            if (isApproved) {
                return res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    token: generateToken(user._id),
                    message: 'Registration successful. Logged in.'
                });
            } else {
                return res.status(202).json({
                    message: 'Registration successful. Waiting for admin approval via email.'
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.role !== 'citizen' && !user.isApproved) {
                return res.status(401).json({ message: 'Account is pending admin approval.' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.getUsersForApproval = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view users for approval' });
        }

        const unapprovedUsers = await User.find({
            role: { $in: ['admin', 'staff'] },
            isApproved: false
        }).select('-password');

        res.json(unapprovedUsers);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.approveUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to approve users' });
        }

        const userToApprove = await User.findById(req.params.id);

        if (userToApprove) {
            userToApprove.isApproved = true;
            await userToApprove.save();

            sendRegistrationApprovalMail(userToApprove.email, userToApprove.name, true);

            res.json({ message: `${userToApprove.role} approved and notified via email.` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ message: 'Server error approving user' });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const staffMembers = await User.find({
            role: { $in: ['staff', 'admin'] },
            isApproved: true
        }).select('-password');

        res.json(staffMembers);
    } catch (error) {
        console.error('Get staff error:', error);
        res.status(500).json({ message: 'Server error fetching staff' });
    }
};
