# COI Verification System

A full-stack application for creating, managing, and verifying Certificates of Insurance (COI) between multiple parties. This system allows users to create insurance certificates, share them via secure public links, and track when they've been viewed and accepted.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JibronHarris/coi-verifcation.git
   cd coi-verifcation
   ```

2. **Install dependencies for both applications**

   ```bash
   # Install all dependencies at once (recommended)
   npm run install:all

   # Or install separately:
   # Install root dependencies (if any)
   npm install

   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up the database**

   Create a PostgreSQL database and configure the connection in `server/.env.dev`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/coi_verification?schema=public"
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   AUTH_SECRET=your-secret-key-here
   ```

   Generate a secure AUTH_SECRET:

   ```bash
   openssl rand -base64 32
   ```

4. **Run database migrations**

   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start both applications**

   **Option 1: Using npm script (Recommended)**

   ```bash
   npm run dev
   ```

   **Option 2: Using shell script**

   ```bash
   ./start.sh
   ```

   **Option 3: Start separately (for debugging)**

   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

## 📁 Project Structure

```
coi-verifcation/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React contexts (AuthContext)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── theme/          # Material-UI theme configuration
│   └── package.json
│
├── server/                  # Express backend application
│   ├── src/
│   │   ├── config/         # Configuration files (database, passport)
│   │   ├── controllers/   # HTTP request/response handlers
│   │   ├── dao/            # Data Access Objects (database layer)
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   └── types/          # TypeScript type definitions
│   ├── prisma/             # Prisma schema and migrations
│   └── package.json
│
└── package.json            # Root package.json with convenience scripts
```

## 🎯 Features

### Core Functionality

- **User Authentication**: Email/password authentication with session management
- **Certificate Management**: Create, view, update, and delete insurance certificates
- **Public Sharing**: Generate secure shareable links for certificates
- **View Tracking**: Track when shareable links are accessed
- **Acceptance Confirmation**: Public users can confirm and accept certificates
- **Status Management**: Track certificate status (active, expired, pending, accepted)

### Frontend Features

- Modern React 19 with TypeScript
- Material-UI for beautiful, responsive UI
- Protected routes with authentication
- Public certificate viewing (no authentication required)
- Real-time status updates
- Shareable link generation and copying

### Backend Features

- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- Session-based authentication with Passport.js
- Layered architecture (Controller → Service → DAO)
- Soft delete support
- Environment-based configuration

## 🔧 Configuration

### Backend Environment Variables

Create `server/.env.dev` for development:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/coi_verification?schema=public"
PORT=3000
CORS_ORIGIN=http://localhost:5173
AUTH_SECRET=your-secret-key-here
```

For production, create `server/.env.prod` with production values.

### Frontend Environment Variables

Create `client/.env` (optional):

```env
VITE_API_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### User Endpoints (Protected)

- `GET /api/user/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Insurance Certificate Endpoints

**Protected Routes:**

- `GET /api/insuranceCertificates` - Get all certificates for authenticated user
- `GET /api/insuranceCertificates/:id` - Get certificate by ID
- `POST /api/insuranceCertificates` - Create new certificate
- `PUT /api/insuranceCertificates/:id` - Update certificate
- `DELETE /api/insuranceCertificates/:id` - Soft delete certificate

**Public Routes (No Authentication Required):**

- `GET /api/insuranceCertificates/public/:token` - View certificate by share token
- `POST /api/insuranceCertificates/public/:token/accept` - Accept/confirm certificate

## 🗄️ Database Schema

### Key Models

- **User**: User accounts with email/password authentication
- **Account**: OAuth accounts (for future OAuth providers)
- **Session**: User sessions
- **InsuranceCertificate**: Insurance certificates with:
  - Certificate details (number, insured party, insurance company)
  - Date range (effective date, expiration date)
  - Status (active, expired, pending, accepted)
  - Share token for public access
  - View tracking (viewedAt, acceptedAt)
  - Soft delete support (deletedAt)

## 🏗️ Architecture

### Backend Architecture

The backend follows a **layered MVC architecture**:

```
Routes → Controllers → Services → DAO → Database
```

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and orchestrate operations
- **DAO**: Data access layer with Prisma queries
- **Database**: PostgreSQL via Prisma ORM

### Frontend Architecture

- **Components**: Reusable UI components
- **Pages**: Route-level page components
- **Services**: API service layer for backend communication
- **Contexts**: React contexts for global state (authentication)
- **Types**: TypeScript type definitions

## 🚦 Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode (using concurrently)
- `npm run start` - Start both applications in production mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend client
- `npm run install:all` - Install dependencies for root, server, and client
- `npm run clean` - Remove all node_modules, package-lock.json files, and build directories
- `npm run clean:root` - Clean root directory only
- `npm run clean:server` - Clean server directory only
- `npm run clean:client` - Clean client directory only
- `npm run clean:install` - Clean everything and reinstall all dependencies
- `npm run build` - Build both applications for production
- `./start.sh` - Alternative shell script to start both applications (logs to files)

**Note:** The `npm run dev` command uses `concurrently` to run both servers in the same terminal. For separate terminals or file logging, use `./start.sh` or start them separately.

### Backend (`server/`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend (`client/`)

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User registers or signs in via `/api/auth/register` or `/api/auth/signin`
2. Backend creates a session and stores it in an HTTP-only cookie
3. Subsequent requests automatically include the session cookie
4. Protected routes check for `req.user` (set by Passport session deserialization)
5. Frontend uses `AuthContext` to manage authentication state

## 📖 Usage Examples

### Creating a Certificate

1. Sign in to the application
2. Navigate to "Certificates of Insurance"
3. Click "Create Certificate"
4. Fill in certificate details:
   - Certificate Number
   - Insured Party
   - Insurance Company
   - Effective Date
   - Expiration Date
5. Submit the form

### Sharing a Certificate

1. View a certificate from the list
2. Find the "Shareable Link" section
3. Click the copy icon to copy the link
4. Share the link with anyone (no account required)

### Accepting a Certificate (Public)

1. Open the shareable link
2. Review the certificate details
3. Check the confirmation checkbox
4. Click "Confirm Acceptance"
5. The certificate status changes to "accepted"

## 🧪 Development

### Installing Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install:all

# Or install individually:
npm install              # Root dependencies
cd server && npm install # Backend dependencies
cd ../client && npm install # Frontend dependencies
```

### Cleaning Dependencies

```bash
# Remove all node_modules and lock files
npm run clean

# Clean and reinstall everything
npm run clean:install

# Clean specific directories:
npm run clean:root    # Root only
npm run clean:server  # Server only
npm run clean:client  # Client only
```

### Running in Development Mode

```bash
# Start both applications
npm run dev

# Or start separately:
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### Database Migrations

```bash
cd server
npm run prisma:migrate
```

### Viewing Database

```bash
cd server
npm run prisma:studio
```

## 🚀 Production Deployment

### Backend

1. Set up production environment variables in `server/.env.prod`
2. Build the application:
   ```bash
   cd server
   npm run build
   ```
3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Set up environment variables in `client/.env`
2. Build the application:
   ```bash
   cd client
   npm run build
   ```
3. Serve the `dist/` directory with a web server (nginx, Apache, etc.)

## 📝 License

ISC

## 👤 Author

Jibron Harris

## 🔗 Links

- [Backend README](./server/README.md) - Detailed backend documentation
- [Frontend README](./client/README.md) - Detailed frontend documentation
- [Frontend Structure Guide](./client/FRONTEND_STRUCTURE.md) - Frontend architecture guide
