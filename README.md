# HireTrack ATS — Multi-Branch Applicant Tracking System

A full-stack recruitment and applicant tracking system built for organizations with multiple office locations. HireTrack lets candidates browse and apply for jobs across branches while giving HR teams and admins a complete suite of tools to manage postings, applications, interviews, and staff.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Seeding the Database](#seeding-the-database)
- [Default Accounts](#default-accounts)
- [Email Notifications](#email-notifications)
- [Role & Permission System](#role--permission-system)
- [File Uploads](#file-uploads)
- [Screenshots / Pages](#screenshots--pages)
- [Known Limitations](#known-limitations)
- [Authors](#authors)

---

## About the Project

HireTrack ATS was built as a final web engineering project to simulate a real-world hiring pipeline. The system supports four office locations — **Islamabad, Lahore, Karachi, and Remote** — and handles the entire recruitment lifecycle from job posting to final selection.

The goal was to create a transparent, merit-based hiring experience where:
- Candidates can apply with a single account across all branches and track every stage of their application in real time.
- HR staff can post jobs, shortlist applicants, and schedule interviews without leaving the platform.
- Admins have full control over users, branches, and system-wide settings.

---

## Features

### For Candidates
- Register and log in with a personal account secured by JWT.
- Browse all active job postings with filters by branch, department, and keyword search.
- Read full job details — description, requirements, qualifications, salary, and deadline.
- Apply for any job by uploading a resume (PDF/DOC/DOCX) and an optional cover letter.
- One application per job enforced by the system.
- Track application status live: Submitted → Under Review → Shortlisted → Interview Scheduled → Selected / Rejected.
- View all upcoming interviews (date, time, location, HR message) in the candidate dashboard.
- Edit profile information at any time.

### For HR Staff
- Post new job openings with detailed descriptions, seat count, type, deadline, and branch.
- Edit or deactivate job listings.
- View all received applications with candidate details and uploaded documents.
- Filter applications by job or status.
- Update application status — each status change triggers an automatic email to the candidate.
- Schedule interviews for shortlisted candidates with date, time, location, and a personal message.
- Monitor all scheduled interviews.

### For Admins
Everything HR can do, plus:
- Manage all registered users — view, update roles, and deactivate accounts.
- Full branch management — create, edit, and deactivate office locations.
- Platform-wide statistics on jobs, applications, and interviews from the admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Frontend Routing | React Router DOM v6 |
| HTTP Client | Axios |
| UI Notifications | React Hot Toast |
| Icons | Font Awesome 6.5 |
| Styling | Vanilla CSS (custom) |
| Backend Framework | Node.js + Express.js |
| Database | MongoDB Atlas (Cloud) |
| ODM | Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Dev Server | Nodemon |

---

## Project Structure

```
Web-Final-project/
│
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB Atlas connection
│   │   └── cloudinary.js          # Cloudinary storage configuration
│   │
│   ├── models/
│   │   ├── User.js                # Candidate, HR, Admin schema
│   │   ├── Job.js                 # Job posting schema
│   │   ├── Application.js         # Application + status tracking
│   │   ├── Interview.js           # Interview scheduling
│   │   └── Branch.js              # Office branch schema
│   │
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, user management
│   │   ├── jobController.js       # CRUD job listings + statistics
│   │   ├── applicationController.js  # Apply, view, update status
│   │   ├── interviewController.js    # Schedule and manage interviews
│   │   └── branchController.js       # Branch CRUD
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── jobRoutes.js           # /api/jobs/*
│   │   ├── applicationRoutes.js   # /api/applications/*
│   │   ├── interviewRoutes.js     # /api/interviews/*
│   │   └── branchRoutes.js        # /api/branches/*
│   │
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protection + role guards
│   │
│   ├── utils/
│   │   └── sendEmail.js           # HTML email templates + Nodemailer
│   │
│   ├── server.js                  # Express app entry point
│   ├── seeder.js                  # Populate DB with demo data
│   ├── .env                       # Environment variables (not committed)
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation with auth-aware menu
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── JobCard.jsx        # Job listing card component
│   │   │   └── ProtectedRoute.jsx # Role-based frontend route guard
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global authentication state
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Jobs.jsx           # Job listings with filters
│   │   │   ├── JobDetail.jsx      # Single job view + apply modal
│   │   │   ├── SignIn.jsx         # Login form
│   │   │   ├── SignUp.jsx         # Registration form
│   │   │   ├── CandidateDashboard.jsx  # My applications + interviews
│   │   │   ├── AdminDashboard.jsx      # Admin stats overview
│   │   │   ├── ManageJobs.jsx          # HR: create and edit jobs
│   │   │   ├── ManageApplications.jsx  # HR: review applications
│   │   │   ├── ManageInterviews.jsx    # HR: schedule interviews
│   │   │   ├── ManageBranches.jsx      # Admin: manage branches
│   │   │   ├── Profile.jsx             # User profile editor
│   │   │   └── NotFound.jsx            # 404 page
│   │   │
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance with JWT interceptor
│   │   │
│   │   ├── App.jsx                # All route definitions
│   │   ├── main.jsx               # React root mount
│   │   └── index.css              # Global styles
│   │
│   ├── vite.config.js             # Vite config + /api proxy to backend
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Unique, required |
| password | String | Hashed with bcryptjs (10 rounds) |
| phone | String | |
| role | String | `candidate` / `hr` / `admin` |
| branch | String | Office location |
| cnic | String | National ID |
| profilePicture | String | URL |
| isActive | Boolean | Default true |

### Job
| Field | Type | Notes |
|---|---|---|
| title | String | Required |
| description | String | |
| department | String | |
| branch | String | Islamabad / Lahore / Karachi / Remote |
| seats | Number | Available positions |
| requirements | String | |
| qualifications | String | |
| salary | String | |
| jobType | String | Full-time / Part-time / Contract / Internship |
| deadline | Date | |
| isActive | Boolean | Default true |
| postedBy | ObjectId | Ref: User |

### Application
| Field | Type | Notes |
|---|---|---|
| candidateId | ObjectId | Ref: User |
| jobId | ObjectId | Ref: Job |
| resumeURL | String | Cloudinary URL |
| coverLetterURL | String | Cloudinary URL (optional) |
| status | String | Submitted / Under Review / Shortlisted / Interview Scheduled / Rejected / Selected |
| appliedDate | Date | |
| hrNotes | String | Internal notes by HR |

Unique constraint on `candidateId + jobId` to prevent duplicate applications.

### Interview
| Field | Type | Notes |
|---|---|---|
| candidateId | ObjectId | Ref: User |
| jobId | ObjectId | Ref: Job |
| applicationId | ObjectId | Ref: Application |
| interviewDate | Date | |
| interviewTime | String | |
| location | String | Default: "Online (Google Meet)" |
| status | String | Scheduled / Completed / Cancelled |
| message | String | Message to the candidate |
| scheduledBy | ObjectId | Ref: User |

### Branch
| Field | Type | Notes |
|---|---|---|
| branchName | String | Unique |
| location | String | |
| manager | String | |
| description | String | |
| isActive | Boolean | Default true |

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new candidate account |
| POST | `/login` | Public | Login and receive a JWT |
| GET | `/me` | Protected | Get the current logged-in user |
| PUT | `/profile` | Protected | Update profile details |
| GET | `/users` | Admin only | List all users |
| PUT | `/users/:id/role` | Admin only | Change user role or active status |

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all active jobs (supports ?branch, ?department, ?search filters) |
| GET | `/:id` | Public | Get a single job by ID |
| POST | `/` | HR / Admin | Create a new job posting |
| PUT | `/:id` | HR / Admin | Update a job posting |
| DELETE | `/:id` | HR / Admin | Deactivate a job posting |
| GET | `/stats` | HR / Admin | Aggregated job statistics |

### Applications — `/api/applications`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Candidate | Submit an application with resume upload |
| GET | `/my` | Candidate | View own applications |
| GET | `/` | HR / Admin | View all applications (supports ?jobId, ?status filters) |
| PUT | `/:id/status` | HR / Admin | Update application status (triggers email) |
| GET | `/stats` | HR / Admin | Aggregated application statistics |

### Interviews — `/api/interviews`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | HR / Admin | Schedule a new interview (sends email to candidate) |
| GET | `/` | HR / Admin | List all interviews |
| GET | `/my` | Candidate | View own scheduled interviews |
| PUT | `/:id` | HR / Admin | Update interview details |

### Branches — `/api/branches`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all active branches |
| POST | `/` | Admin | Create a new branch |
| PUT | `/:id` | Admin | Update branch details |
| DELETE | `/:id` | Admin | Deactivate a branch |

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Cloudinary](https://cloudinary.com/) account (for resume storage)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled (for email sending)

---

### Environment Variables

Inside the `backend/` folder, create a `.env` file using the template below. You can also copy `backend/.env.example` and fill in the values.

```env
# Server
PORT=5001

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ats_db

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Cloudinary (for resume and document storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail with App Password)
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for CORS and email links)
CLIENT_URL=http://localhost:5173
```

> **Important:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Haseebzahid9/Web-Final-project.git
cd Web-Final-project
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Running the App

You need two terminal windows — one for the backend, one for the frontend.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

The Express server starts on `http://localhost:5001`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The React app starts on `http://localhost:5173`.

Open your browser and go to `http://localhost:5173`.

---

### Seeding the Database

To populate the database with demo branches, jobs, and starter accounts, run:

```bash
cd backend
npm run seed
```

This will insert:
- 4 office branches (Islamabad, Lahore, Karachi, Remote)
- 6 sample job postings across different departments
- 1 Admin account
- 1 HR account

---

## Default Accounts

After running the seeder, you can log in with these credentials:

| Role | Email | Password |
|---|---|---|
| Admin | haseebzahid4998@gmail.com | Admin@123 |
| HR | f230644@cfd.nu.edu.pk | Hr@12345 |

To create a candidate account, use the Sign Up page on the frontend.

---

## Email Notifications

Automated emails are sent to candidates at the following stages:

| Trigger | Email Content |
|---|---|
| Application submitted | Confirmation with job title and application number |
| Status changed to Shortlisted | Congratulations message with next steps |
| Status changed to Rejected | Polite rejection with encouragement to apply again |
| Interview scheduled | Date, time, location, and a personal message from HR |

All emails are sent as styled HTML through Gmail SMTP using Nodemailer. Make sure your Gmail account has 2-Step Verification enabled and you are using an App Password (not your regular Gmail password) in the `.env` file.

---

## Role & Permission System

The system has three roles with layered permissions:

| Permission | Candidate | HR | Admin |
|---|---|---|---|
| Browse and apply for jobs | Yes | — | — |
| View own applications and interviews | Yes | — | — |
| Post and edit job listings | — | Yes | Yes |
| View all applications and update status | — | Yes | Yes |
| Schedule interviews | — | Yes | Yes |
| Manage users (view, roles, deactivation) | — | — | Yes |
| Manage office branches | — | — | Yes |
| View admin statistics dashboard | — | — | Yes |

**How it works:**

- On login, the backend returns a JWT containing the user's `id` and `role`.
- The token is stored in `localStorage` and automatically attached to every API request by an Axios interceptor.
- Backend middleware validates the token on all protected routes and checks the user's role before allowing access.
- On the frontend, `<ProtectedRoute>` components redirect unauthorized users away from restricted pages.
- If a token expires or is invalid, the backend returns `401` and the frontend automatically logs the user out.

---

## File Uploads

Resumes and cover letters are uploaded directly to Cloudinary and never stored on the server.

- **Accepted formats:** PDF, DOC, DOCX
- **Size limit:** 5 MB per file
- **Storage:** Cloudinary cloud storage (URLs saved to MongoDB)
- **Library:** Multer + multer-storage-cloudinary

---

## Screenshots / Pages

| Page | URL | Who Can Access |
|---|---|---|
| Home / Landing | `/` | Everyone |
| Job Listings | `/jobs` | Everyone |
| Job Detail + Apply | `/jobs/:id` | Everyone (apply requires login) |
| Sign In | `/signin` | Public |
| Sign Up | `/signup` | Public |
| Candidate Dashboard | `/dashboard` | Candidates |
| Admin Dashboard | `/admin` | Admin |
| Manage Jobs | `/manage-jobs` | HR + Admin |
| Manage Applications | `/manage-applications` | HR + Admin |
| Manage Interviews | `/manage-interviews` | HR + Admin |
| Manage Branches | `/manage-branches` | Admin |
| Profile | `/profile` | All logged-in users |

---

## Known Limitations

- JWT tokens are stored in `localStorage`. For a production app, consider using HTTP-only cookies and implementing refresh token rotation.
- There is no password reset or "forgot password" flow yet.
- File upload validation is done client-side; additional server-side MIME type checking would improve security.
- No pagination is implemented on large lists (applications, users). This may slow down at scale.
- The seeder will fail silently if the email already exists in the database — run it only on a fresh or cleared database.

---

## Authors

**Haseeb Zahid**
- GitHub: [@Haseebzahid9](https://github.com/Haseebzahid9)
- Email: haseebzahid4998@gmail.com

Built as a final project for the Web Engineering course — FAST National University of Computer and Emerging Sciences, 2026.
