# CrowdCivic-Issue-Reporting-And-Resolution
# CrowdCiv - Crowdsourced Civic Issue Reporting System

A full-stack web application for reporting and managing civic issues with real-time tracking, role-based access control, and email notifications.

## Features

- User authentication with role-based access (Citizen, Staff, Admin)
- Report civic issues with image upload (Cloudinary integration)
- Interactive map view with filters
- Real-time issue tracking and status updates
- Hot issues section with like functionality
- Email notifications for issue creation, resolution, and approvals
- Admin dashboard for user and report management
- Staff portal for assigned task management
- Analytics dashboard

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Nodemailer for email notifications
- Multer for file uploads

### Frontend
- React 18
- React Router DOM v6
- Axios for API calls
- Leaflet & React-Leaflet for maps
- Tailwind CSS for styling
- Lucide React for icons

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/
│   │   └── mailer.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Analytics/
│   │   │   ├── Auth/
│   │   │   ├── HotIssues/
│   │   │   ├── Layout/
│   │   │   ├── Map/
│   │   │   ├── Reports/
│   │   │   └── Staff/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ReportsContext.jsx
│   │   ├── pages/
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account for email notifications

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variable:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/unapproved` - Get unapproved staff/admin (Admin only)
- PUT `/api/auth/:id/approve` - Approve user (Admin only)
- GET `/api/auth/staff` - Get all staff members (Admin only)

### Reports
- POST `/api/reports` - Create new report (with image upload)
- GET `/api/reports` - Get all reports (with filters)
- GET `/api/reports/:id` - Get report by ID
- GET `/api/reports/my-reports` - Get user's reports
- GET `/api/reports/assigned` - Get assigned reports (Staff/Admin)
- PUT `/api/reports/:id` - Update report (Staff/Admin)
- POST `/api/reports/:id/comment` - Add comment/feedback
- POST `/api/reports/:id/like` - Toggle like on report

## User Roles

### Citizen
- Report issues
- View all issues on map
- Track own reported issues
- Like/unlike issues
- Provide feedback on resolved issues

### Staff
- All Citizen permissions
- View assigned issues
- Update issue status
- Add progress comments
- Requires admin approval on registration

### Admin
- All Staff permissions
- Approve staff/admin registrations
- Assign issues to staff
- Manage all reports
- View analytics
- Manage priorities

## Email Notifications

The system sends emails for:
1. User registration (approval pending/approved)
2. New issue submission confirmation
3. Issue resolved notification with feedback link
4. Staff/Admin approval notifications

## Development Notes

### First Admin User
The first admin or staff user to register is auto-approved. Subsequent staff/admin registrations require approval.

### Image Upload
Images are uploaded to Cloudinary and URLs are stored in MongoDB.

### Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control

## Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## License
MIT

## Contributors
CrowdCiv Development Team
