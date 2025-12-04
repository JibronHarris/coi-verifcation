# COI Verification Backend

Express + Prisma + Passport.js backend with TypeScript support.

## Features

- ✅ TypeScript configuration
- ✅ Express server
- ✅ Prisma ORM with PostgreSQL
- ✅ Passport.js with Local Strategy for email/password authentication
- ✅ Session-based authentication with express-session
- ✅ Protected routes with authentication middleware
- ✅ User registration and authentication
- ✅ Insurance Certificate management (CRUD operations)
- ✅ Soft delete support for insurance certificates

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

- `POST /api/auth/signin` - Sign in with email/password (creates session)

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/signout` - Sign out (destroys session)
- `GET /api/auth/session` - Get current session/user

### User Routes (Protected)

- `GET /api/user/me` - Get current authenticated user
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication, can only update own profile)
- `DELETE /api/users/:id` - Delete user (requires authentication, can only delete own account)

### Insurance Certificate Routes (Protected)

All insurance certificate routes require authentication and users can only access/modify their own certificates.

- `GET /api/insuranceCertificates` - Get all certificates for the authenticated user

- `GET /api/insuranceCertificates/:id` - Get certificate by ID (must be owned by user)

- `POST /api/insuranceCertificates` - Create a new certificate

  ```json
  {
    "certificateNumber": "CERT-12345",
    "insuredParty": "Acme Corporation",
    "insuranceCompany": "Insurance Co.",
    "effectiveDate": "2024-01-01T00:00:00.000Z",
    "expirationDate": "2024-12-31T23:59:59.999Z",
    "status": "active"
  }
  ```

- `PUT /api/insuranceCertificates/:id` - Update certificate (must be owned by user)

  ```json
  {
    "certificateNumber": "CERT-12345",
    "insuredParty": "Updated Party Name",
    "insuranceCompany": "Updated Insurance Co.",
    "effectiveDate": "2024-01-01T00:00:00.000Z",
    "expirationDate": "2024-12-31T23:59:59.999Z",
    "status": "active"
  }
  ```

- `DELETE /api/insuranceCertificates/:id` - Soft delete certificate (must be owned by user)

### Health Check

- `GET /health` - Server health check

## Authentication

The backend uses **Passport.js with Local Strategy** for email/password authentication. The authentication flow works as follows:

1. **Registration**: Users register with email and password via `POST /api/auth/register`
2. **Sign In**: Users sign in using `POST /api/auth/signin` which:
   - Validates credentials using Passport Local Strategy
   - Creates an express-session and stores it in a cookie
   - Returns user data in the response
3. **Session Management**: Subsequent requests automatically include the session cookie
4. **Session Validation**: Protected routes use the `requireAuth` middleware which checks for `req.user` (populated by Passport from the session)

**Session Configuration:**

- Sessions are stored server-side using express-session
- Session cookies are HTTP-only and secure (in production)
- Sessions expire after 30 days
- Session secret is configured via `AUTH_SECRET` environment variable

**Protected Routes:**
All routes under `/api/user`, `/api/users`, and `/api/insuranceCertificates` require authentication. The `requireAuth` middleware checks if `req.user` exists (set by Passport session deserialization).

## Database Schema

The Prisma schema includes:

- **User** - User accounts with email/password authentication
- **Account** - OAuth accounts (for future OAuth providers)
- **Session** - User sessions (for Auth.js compatibility, though currently using express-session)
- **VerificationToken** - Email verification tokens (for future email verification)
- **InsuranceCertificate** - Insurance certificates with:
  - Certificate details (number, insured party, insurance company)
  - Date range (effective date, expiration date)
  - Status (active, expired, pending)
  - Soft delete support (deletedAt field)
  - Association with Account (via accountId)

## Architecture

This backend follows a **layered MVC (Model-View-Controller) architecture** with clear separation of concerns. The architecture pattern flows as follows:

```
Client (HTTP Request)
        |
        v
+------------------+
|   Controller     |  <- Handles HTTP request/response, validation
+------------------+
        |
        v
+------------------+
|    Service       |  <- Business logic, orchestrates operations
+------------------+
        |
        v
+------------------+
|   DAO (Data      |  <- Data access layer (DB queries, ORM)
|   Access Object) |
+------------------+
        |
        v
+------------------+
|   Database       |  <- Actual data storage (PostgreSQL via Prisma)
+------------------+
```

### Directory Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Prisma client instance
│   └── passport.ts   # Passport authentication config
├── controllers/      # HTTP request/response handlers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── insurance-certificate.controller.ts
├── services/         # Business logic layer
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── insurance-certificate.service.ts
├── dao/              # Data Access Objects (database operations)
│   ├── user.dao.ts
│   └── insurance-certificate.dao.ts
├── types/            # TypeScript types/interfaces (DTOs)
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── insurance-certificate.types.ts
│   └── express.d.ts
├── middleware/       # Express middleware
│   └── auth.middleware.ts
└── routes/           # Route definitions (thin layer)
    ├── auth.routes.ts
    ├── user.routes.ts
    └── insurance-certificate.routes.ts
```

### Layer Responsibilities

#### 1. **Routes** (`routes/`)

- Define API endpoints
- Map HTTP methods to controller methods
- Apply middleware (authentication, validation)

**Example:**

```typescript
router.get("/me", requireAuth, (req, res, next) =>
  userController.getCurrentUser(req, res, next)
);
```

#### 2. **Controllers** (`controllers/`)

- Handle HTTP requests and responses
- Validate request data
- Call services for business logic
- Format responses
- Handle errors and status codes

**Example:**

```typescript
async getCurrentUser(req: Request, res: Response) {
  const user = req.user as AuthUserDto;
  const dbUser = await userService.getUserById(user.id);
  if (!dbUser) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(dbUser);
}
```

#### 3. **Services** (`services/`)

- Contain business logic
- Orchestrate operations
- Enforce business rules
- Call DAOs for data access
- Transform data between layers

**Example:**

```typescript
async updateUser(id: string, data: UpdateUserDto) {
  // Business logic: check if user exists
  const existingUser = await userDao.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }
  // Delegate to DAO
  return userDao.update(id, data);
}
```

#### 4. **DAO (Data Access Objects)** (`dao/`)

- Handle all database operations
- Encapsulate Prisma queries
- Return typed data
- Handle data normalization (e.g., email lowercasing)

**Example:**

```typescript
async findById(id: string): Promise<UserResponseDto | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, ... }
  });
}
```

#### 5. **Types** (`types/`)

- Define TypeScript interfaces for API contracts
- Type-safe request/response shapes
- Separate from Prisma domain models

**Example:**

```typescript
export interface UserResponseDto {
  id: string;
  name: string | null;
  email: string | null;
  // ... other fields
}
```

#### 6. **Config** (`config/`)

- Database connection (Prisma client)
- Passport.js authentication configuration (Local Strategy for email/password)
- Other application-wide configuration

#### 7. **Middleware** (`middleware/`)

- Reusable Express middleware
- Authentication checks
- Request validation
- Error handling

### Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Testability**: Easy to mock dependencies (e.g., mock DAO in service tests)
3. **Maintainability**: Changes to database don't affect business logic
4. **Scalability**: Easy to add new features following the same pattern
5. **Type Safety**: TypeScript types ensure data consistency across layers

### Data Flow Example

**Request: `GET /api/users/:id`**

1. **Route** (`user.routes.ts`) → Matches route, applies `requireAuth` middleware
2. **Controller** (`user.controller.ts`) → Extracts `id` from params, calls service
3. **Service** (`user.service.ts`) → Business logic (e.g., authorization check), calls DAO
4. **DAO** (`user.dao.ts`) → Executes Prisma query: `prisma.user.findUnique()`
5. **Database** → Returns data
6. **DAO** → Returns typed `UserResponseDto`
7. **Service** → Returns to controller
8. **Controller** → Formats response, sends JSON to client

### Adding New Features

To add a new feature (e.g., "Posts"):

1. Create `types/post.types.ts` - Define Post types (DTOs)
2. Create `dao/post.dao.ts` - Database operations for posts
3. Create `services/post.service.ts` - Business logic for posts
4. Create `controllers/post.controller.ts` - HTTP handlers for posts
5. Create `routes/post.routes.ts` - Define post endpoints
6. Register routes in `index.ts`

**Example:** The Insurance Certificate feature follows this pattern:

- `types/insurance-certificate.types.ts` - DTOs for create/update operations
- `dao/insurance-certificate.dao.ts` - Prisma queries with soft delete support
- `services/insurance-certificate.service.ts` - Business logic (ownership checks, date validation)
- `controllers/insurance-certificate.controller.ts` - HTTP request/response handling
- `routes/insurance-certificate.routes.ts` - Route definitions with `requireAuth` middleware

## Development

- Source code is in `src/`
- Compiled JavaScript is in `dist/`
- TypeScript config is in `tsconfig.json`
- Prisma schema is in `prisma/schema.prisma`
