# Backend API

This is the backend API for the Web3 Task Manager application.

## Features

- User authentication with JWT
- Task management with CRUD operations
- Background job processing with Bull queue
- PostgreSQL database with Prisma ORM

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/web3_task_manager"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Redis (optional - for background job processing)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
REDIS_USERNAME=""

# Server
PORT=3000
```

3. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

4. Start the development server:

```bash
pnpm start:dev
```

## Redis Configuration

The application uses Bull queue for background job processing. Redis is optional - if Redis is not available, tasks will be processed immediately.

### Option 1: Use Redis (Recommended for production)

- Install Redis on your system
- Set the Redis environment variables in your `.env` file
- Tasks will be processed in the background with retry logic

### Option 2: No Redis (Development/Testing)

- Leave Redis environment variables empty or don't set them
- Tasks will be processed immediately when started
- This is fine for development and testing

## API Endpoints

- `POST /auth/login` - Authenticate user
- `GET /tasks` - Get paginated tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/start-processing` - Start task processing
