const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    isFeedback: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const ReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'], default: 'Normal' },
    status: { type: String, enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Submitted' },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    imageUrl: { type: String },
    cloudinaryId: { type: String },
    comments: [CommentSchema],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    isHot: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
// const mongoose = require('mongoose');

// // Comment sub-schema
// const CommentSchema = new mongoose.Schema({
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to User
//   text: { type: String, required: true },
//   isFeedback: { type: Boolean, default: false }, // feedback comment
//   createdAt: { type: Date, default: Date.now }
// });

// // Main Report schema
// const ReportSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     category: { type: String, required: true },
//     priority: {
//       type: String,
//       enum: ['Low', 'Normal', 'High', 'Critical'],
//       default: 'Normal'
//     },
//     status: {
//       type: String,
//       enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
//       default: 'Submitted'
//     },
//     location: {
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//       address: { type: String }
//     },
//     reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     imageUrl: { type: String },
//     cloudinaryId: { type: String },
//     comments: [CommentSchema],
//     likes: { type: Number, default: 0 },
//     likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // store user IDs who liked
//     isHot: { type: Boolean, default: false }
//   },
//   {
//     timestamps: true
//   }
// );

// // Optional: pre-save middleware to automatically mark hot issues
// ReportSchema.pre('save', function (next) {
//   // Mark as hot if likes >= 5 (adjust threshold as needed)
//   this.isHot = this.likes >= 5;
//   next();
// });

// module.exports = mongoose.model('Report', ReportSchema);
