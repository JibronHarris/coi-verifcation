# COI Verification Backend

Express + Prisma + Auth.js backend with TypeScript support.

## Features

- ✅ TypeScript configuration
- ✅ Express server
- ✅ Prisma ORM with PostgreSQL
- ✅ Auth.js integration with email/password authentication
- ✅ Protected routes with authentication middleware
- ✅ User registration and authentication

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The backend uses separate environment files for development and production:

**Development Environment (`.env.dev`):**

Create a `.env.dev` file in the `server` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/coi_verification?schema=public"
PORT=3000
CORS_ORIGIN=http://localhost:3000
AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
```

**Production Environment (`.env.prod`):**

Create a `.env.prod` file in the `server` directory (you can copy from `.env.prod.example`):

```env
DATABASE_URL="postgresql://user:password@your-production-host:5432/coi_verification?schema=public"
PORT=3000
CORS_ORIGIN=https://your-production-domain.com
AUTH_SECRET=your-production-secret-key-here-generate-with-openssl-rand-base64-32
```

Generate an AUTH_SECRET:

```bash
openssl rand -base64 32
```

**Note:** The backend automatically loads `.env.dev` in development mode and `.env.prod` in production mode based on the `NODE_ENV` environment variable.

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Build and Run

```bash
# Development mode (with auto-reload, uses .env.dev)
npm run dev

# Production mode (uses .env.prod)
npm run build
npm start
```

**Environment Files:**

- Development: Uses `.env.dev` (automatically set when running `npm run dev`)
- Production: Uses `.env.prod` (automatically set when running `npm start`)

## API Routes

### Authentication Routes

- `POST /api/auth/register` - Register a new user

  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- `POST /api/auth/signin` - Sign in with email/password (handled by Auth.js)
- `POST /api/auth/signout` - Sign out (handled by Auth.js)
- `GET /api/auth/session` - Get current session (handled by Auth.js)

### User Routes (Protected)

- `GET /api/user/me` - Get current authenticated user
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication, can only update own profile)
- `DELETE /api/users/:id` - Delete user (requires authentication, can only delete own account)

### Health Check

- `GET /health` - Server health check

## Authentication

The backend uses Auth.js with Credentials provider for email/password authentication. Users must:

1. Register with email and password
2. Sign in using `/api/auth/signin` endpoint
3. Include session cookies in subsequent requests

Protected routes use the `requireAuth` middleware which checks for a valid session.

## Database Schema

The Prisma schema includes:

- **User** - User accounts with email/password
- **Account** - OAuth accounts (for future OAuth providers)
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

## Development

- Source code is in `src/`
- Compiled JavaScript is in `dist/`
- TypeScript config is in `tsconfig.json`
- Prisma schema is in `prisma/schema.prisma`
