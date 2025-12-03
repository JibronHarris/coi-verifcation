# COI Verification Frontend

Simple React + Vite frontend with login functionality.

## Features

- ✅ Vite for fast development
- ✅ React 19
- ✅ Login and Registration forms
- ✅ Session management with Auth.js
- ✅ Connected to backend API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Backend Connection

The frontend connects to the backend at `http://localhost:3000` by default. This is configured via:

- Vite proxy in `vite.config.js` (for `/api` routes)
- `VITE_API_URL` environment variable (optional, defaults to `http://localhost:3000`)

Make sure your backend server is running on port 3000.

## Authentication

The app uses Auth.js with cookie-based sessions. No manual token handling is needed - cookies are automatically sent with requests using `credentials: 'include'`.

### Available Features

- **Login**: Sign in with email and password
- **Register**: Create a new account
- **Session Check**: Automatically checks if user is logged in
- **Sign Out**: Log out and clear session

## API Endpoints Used

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/register` - Register new user
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
