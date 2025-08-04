# Web3 Task Manager

A modern task management application with Web3 authentication using wallet signatures.

## Features

- **Web3 Authentication**: Connect and authenticate using MetaMask or any Web3 wallet
- **Message Signing**: Secure authentication through wallet message signing
- **JWT Tokens**: Session management with JWT tokens
- **Protected Routes**: Secure API endpoints requiring authentication
- **Modern UI**: Beautiful, responsive interface
- **Mobile Friendly**: Works on all devices
- **Performance Optimized**: Handles 10,000+ tasks efficiently with virtualization, pagination, and lazy loading
- **Advanced Search**: Real-time search and filtering capabilities
- **Virtual Scrolling**: Smooth performance with large datasets

## Tech Stack

### Frontend

- React 19 with TypeScript
- MetaMask Web3 integration
- Wagmi for wallet connection
- Vite for fast development

### Backend

- NestJS with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- Ethers.js for signature verification

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database
- MetaMask or any Web3 wallet

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd web3-task-manager
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database and update the connection string in `apps/backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/web3_task_manager"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
REDIS_HOST=host
REDIS_PORT=port
REDIS_PASSWORD=pass
```

### 3. Run Database Migrations

```bash
cd apps/backend
pnpm prisma migrate dev
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:frontend  # Frontend on http://localhost:5173
pnpm dev:backend   # Backend on http://localhost:3000
```

### 5. Connect Your Wallet

1. Open http://localhost:5173 in your browser
2. Click "Connect Wallet" to connect MetaMask
3. Sign the authentication message
4. Start managing your tasks!

## Authentication Flow

1. **Wallet Connection**: User connects their Web3 wallet (MetaMask, etc.)
2. **Nonce Generation**: Backend generates a unique nonce for the user
3. **Message Signing**: User signs the authentication message with their wallet
4. **Signature Verification**: Backend verifies the signature using ethers.js
5. **JWT Token**: Backend issues a JWT token for session management
6. **Protected Access**: User can now access protected routes with the JWT token

## API Endpoints

### Authentication

- `GET /auth/nonce/:wallet` - Get authentication nonce
- `POST /auth/authenticate` - Authenticate with signature

### Tasks (Protected)

- `GET /tasks` - Get user's tasks, search, and filtering
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/start-processing` - Start task processing

### Query Parameters for Tasks

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search in title and description
- `status` - Filter by status (pending, processing, processed, failed)

## Performance Optimizations

### Large Task List Handling (10,000+ Tasks)

The application is optimized to handle large numbers of tasks efficiently:

#### Frontend Optimizations

- **Virtual Scrolling**: Only renders visible task items, dramatically reducing DOM nodes
- **Debounced Search**: Prevents excessive API calls during typing
- **Lazy Loading**: Tasks are loaded on-demand as needed
- **Memoization**: Components are optimized to prevent unnecessary re-renders

#### Backend Optimizations

- **Database Pagination**: Efficient SQL queries with LIMIT and OFFSET
- **Indexed Queries**: Optimized database indexes for fast searches
- **Filtering**: Server-side filtering by status and search terms
- **Caching**: Background job results are cached to reduce database load

#### Performance Features

- **Real-time Search**: Instant filtering as you type
- **Status Filtering**: Filter by task status (pending, processing, processed, failed)
- **Loading States**: Smooth loading indicators for better UX

## Project Structure

```
web3-task-manager/
├── apps/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Tasks/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── VirtualizedTaskList.tsx  # Virtual scrolling
│   │   │   │   │   │   └── Search.tsx      # Search & filtering
│   │   │   │   │   └── index.tsx                    # Main tasks component
│   │   │   │   └── ...
│   │   │   └── stores
│   │   └── ...
│   └── backend/           # NestJS API
│       ├── src/
│       │   ├── auth/      # Authentication module
│       │   ├── tasks/     # Tasks module with pagination
│       │   ├── prisma/    # Database service
│       │   └── ...
│       └── ...
└── ...
```

## Development

### Frontend Development

```bash
cd apps/frontend
pnpm dev
```

### Backend Development

```bash
cd apps/backend
pnpm start:dev
```

### Database Management

```bash
cd apps/backend
pnpm prisma studio  # Open Prisma Studio
pnpm prisma migrate dev  # Run migrations
pnpm prisma generate  # Generate Prisma client
```

## Security Considerations

- **JWT Secret**: Change the JWT secret in production
- **CORS**: Configure CORS properly for production
- **Rate Limiting**: Implement rate limiting for auth endpoints
- **Nonce Storage**: Use Redis for nonce storage in production
- **HTTPS**: Always use HTTPS in production

## CORS Configuration

The backend is configured with permissive CORS settings for development (`origin: true`). For production, update the CORS configuration in `apps/backend/src/main.ts` to specify exact allowed origins for security.
