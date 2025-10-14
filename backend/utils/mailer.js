// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// const sendMail = async (to, subject, htmlContent) => {
//     try {
//         await transporter.sendMail({
//             from: `"CrowdCiv Support" <${process.env.EMAIL_USER}>`,
//             to,
//             subject,
//             html: htmlContent
//         });
//         console.log(`Email sent to ${to} with subject: ${subject}`);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// module.exports = {
//     sendRegistrationApprovalMail: (to, name, isApproved) => {
//         const subject = isApproved ? 'Your CrowdCiv Account is Approved! 🎉' : 'CrowdCiv Account Registration Awaiting Approval';
//         const html = isApproved
//             ? `<p>Hi ${name},</p><p>Great news! Your account has been approved. You can now log in and start helping the community!</p><p>Thank you,<br>CrowdCiv Team</p>`
//             : `<p>Hi ${name},</p><p>Thank you for registering. Your account is currently pending review by an administrator. We'll send you an approval email shortly!</p><p>CrowdCiv Team</p>`;
//         sendMail(to, subject, html);
//     },

//     sendNewIssueMail: (to, title, issueId) => {
//         const subject = `Your Issue "${title}" has been Submitted`;
//         const html = `<p>Hi,</p><p>Your issue <strong>${title}</strong> (ID: ${issueId}) has been successfully submitted. You can track its status in the "My Reports" section.</p><p>We appreciate your contribution!</p><p>CrowdCiv Team</p>`;
//         sendMail(to, subject, html);
//     },

//     sendIssueResolvedMail: (to, title, issueId, feedbackLink) => {
//         const subject = `Issue "${title}" is Resolved! ✅`;
//         const html = `<p>Hello,</p><p>We are pleased to inform you that your issue <strong>${title}</strong> (ID: ${issueId}) has been marked as <strong>Resolved</strong>.</p><p>Please provide your feedback by clicking this link: <a href="${feedbackLink}">Give Feedback</a></p><p>CrowdCiv Team</p>`;
//         sendMail(to, subject, html);
//     }
// };
// import dotenv from 'dotenv';
// dotenv.config();

// import nodemailer from 'nodemailer';

// // Create transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS // Use App Password
//     }
// });

// // Generic sendMail function
// const sendMail = async (to, subject, htmlContent) => {
//     try {
//         await transporter.sendMail({
//             from: `"CrowdCiv Support" <${process.env.EMAIL_USER}>`,
//             to,
//             subject,
//             html: htmlContent
//         });
//         console.log(`Email sent to ${to} with subject: ${subject}`);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// // Specific email functions
// export const sendRegistrationApprovalMail = (to, name, isApproved) => {
//     const subject = isApproved
//         ? 'Your CrowdCiv Account is Approved! 🎉'
//         : 'CrowdCiv Account Registration Awaiting Approval';
//     const html = isApproved
//         ? `<p>Hi ${name},</p><p>Great news! Your account has been approved. You can now log in and start helping the community!</p><p>Thank you,<br>CrowdCiv Team</p>`
//         : `<p>Hi ${name},</p><p>Thank you for registering. Your account is currently pending review by an administrator. We'll send you an approval email shortly!</p><p>CrowdCiv Team</p>`;
//     sendMail(to, subject, html);
// };

// export const sendNewIssueMail = (to, title, issueId) => {
//     const subject = `Your Issue "${title}" has been Submitted`;
//     const html = `<p>Hi,</p><p>Your issue <strong>${title}</strong> (ID: ${issueId}) has been successfully submitted. You can track its status in the "My Reports" section.</p><p>We appreciate your contribution!</p><p>CrowdCiv Team</p>`;
//     sendMail(to, subject, html);
// };

// export const sendIssueResolvedMail = (to, title, issueId, feedbackLink) => {
//     const subject = `Issue "${title}" is Resolved! ✅`;
//     const html = `<p>Hello,</p><p>We are pleased to inform you that your issue <strong>${title}</strong> (ID: ${issueId}) has been marked as <strong>Resolved</strong>.</p><p>Please provide your feedback by clicking this link: <a href="${feedbackLink}">Give Feedback</a></p><p>CrowdCiv Team</p>`;
//     sendMail(to, subject, html);
// };
//////////
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use Gmail App Password
    }
});

// Generic sendMail function
const sendMail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"CrowdCiv Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        });
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Specific email functions
module.exports = {
    sendRegistrationApprovalMail: (to, name, isApproved) => {
        const subject = isApproved
            ? 'Your CrowdCiv Account is Approved! 🎉'
            : 'CrowdCiv Account Registration Awaiting Approval';
        const html = isApproved
            ? `<p>Hi ${name},</p><p>Great news! Your account has been approved. You can now log in and start helping the community!</p><p>Thank you,<br>CrowdCiv Team</p>`
            : `<p>Hi ${name},</p><p>Thank you for registering. Your account is currently pending review by an administrator. We'll send you an approval email shortly!</p><p>CrowdCiv Team</p>`;
        sendMail(to, subject, html);
    },

    sendNewIssueMail: (to, title, issueId) => {
        const subject = `Your Issue "${title}" has been Submitted`;
        const html = `<p>Hi,</p><p>Your issue <strong>${title}</strong> (ID: ${issueId}) has been successfully submitted. You can track its status in the "My Reports" section.</p><p>We appreciate your contribution!</p><p>CrowdCiv Team</p>`;
        sendMail(to, subject, html);
    },

    sendIssueResolvedMail: (to, title, issueId, feedbackLink) => {
        const subject = `Issue "${title}" is Resolved! ✅`;
        const html = `<p>Hello,</p><p>We are pleased to inform you that your issue <strong>${title}</strong> (ID: ${issueId}) has been marked as <strong>Resolved</strong>.</p><p>Please provide your feedback by clicking this link: <a href="${feedbackLink}">Give Feedback</a></p><p>CrowdCiv Team</p>`;
        sendMail(to, subject, html);
    }
};
