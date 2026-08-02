# EventM

EventM is a full-stack event management platform for corporate teams. It helps employees discover upcoming celebrations, create events, vote in polls, share event photos, receive announcements, and manage birthday or work-anniversary calendars from one place.

This repository contains the frontend application. The complete project also includes a separate backend API:

- Frontend: Next.js application in this repository
- Backend: Express and MongoDB API in `../EventM_Backend`

## Project Overview

EventM is built around two user experiences:

- Employees can sign up, sign in, view dashboards, browse events, RSVP, vote in polls, upload gallery photos, check notifications, and manage personal settings.
- Admins can manage users, events, polls, gallery moderation, announcements, dashboard statistics, and application settings.

The frontend communicates with the backend through cookie-based authentication and the API base URL configured with `NEXT_PUBLIC_API_URL`.

## Features

- Authentication pages for sign in, sign up, email verification, forgot password, and reset password
- User dashboard with upcoming events, celebrations, announcements, and activity data
- Admin dashboard with statistics, moderation tools, and management panels
- Event listing, event details, event creation, editing, deleting, and RSVP support
- Birthday and work-anniversary calendar views
- Poll creation, voting, results, updates, closing, and deletion
- Gallery upload, album browsing, image approval, image rejection, and image deletion
- Notifications with read and mark-all-read actions
- User settings and password changes
- Responsive UI built with reusable shared and UI components

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Lucide React icons
- Axios and Fetch API
- Prisma with local SQLite schema in `prisma/`
- Backend API: Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary

## Folder Structure

```text
Event_M/
|-- app/                  # App Router pages and layouts
|   |-- (auth)/           # Auth pages
|   |-- (root)/           # Landing/home route
|   |-- admin/            # Admin management pages
|   |-- Calendar/         # Calendar page
|   |-- Events/           # Event listing, details, and creation
|   |-- Gallery/          # Gallery page
|   |-- Poll/             # Poll listing and creation
|   |-- UserDashboard/    # User dashboard
|   |-- notifications/    # Notifications page
|   `-- settings/         # User settings page
|-- components/           # Reusable UI, shared, and admin components
|-- constants/            # Navigation and shared constants
|-- context/              # Auth context
|-- lib/                  # Utility integrations and helpers
|-- prisma/               # Prisma schema and local SQLite database
|-- public/               # Images, icons, and static assets
|-- services/             # API client functions
`-- styles/               # Design tokens
```

## Backend Connection

The frontend expects the backend API to be running separately.

Default API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

The backend must allow the frontend origin through CORS. For local development, the backend `.env` should include:

```env
CORS_ORIGIN=http://localhost:3000
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Running EventM backend API

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

If you use the optional local Prisma/Nodemailer utilities, also configure the related variables used by your environment:

```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

## Available Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Build production application
npm run start    # Start production server
npm run lint     # Run Next.js linting
```

## Important Routes

```text
/                         Home page
/sign-in                  Sign in
/sign-up                  Sign up
/verify-email             Email verification
/forgot-password          Forgot password
/reset-password           Reset password
/UserDashboard            Employee dashboard
/AdminDashboard           Admin dashboard
/admin                    Admin overview
/admin/users              User management
/admin/events             Event management
/admin/polls              Poll management
/admin/gallery            Gallery moderation
/admin/announcements      Announcements management
/Events                   Events list
/Events/Create            Create event
/Events/[id]              Event details
/Calendar                 Calendar
/Poll                     Polls
/Poll/Create              Create poll
/Gallery                  Gallery
/notifications            Notifications
/settings                 Settings
```

## API Usage

Most API calls are centralized in:

```text
services/api.ts
```

The frontend uses `credentials: "include"` so the backend can read and set authentication cookies. Make sure the backend CORS settings and cookie settings match the frontend domain in production.

## Deployment Notes

Before deploying:

- Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL.
- Configure backend CORS to allow the deployed frontend URL.
- Configure production JWT secrets, MongoDB URI, and Cloudinary credentials in the backend.
- Avoid committing `.env`, `.env.local`, database files, or uploaded images.

## Related Backend Repository

The backend README is available in:

```text
../EventM_Backend/Readme.md
```

Run the backend first, then start the frontend so the dashboard, auth, events, polls, gallery, and admin pages can load data correctly.
