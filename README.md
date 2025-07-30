# web3-task-manager

Technical Task - Web3 Authenticated Task Manager

## Repository Structure

This project uses a Turbo monorepo structure to manage both backend and frontend applications:

```
web3-task-manager/
├── apps/
│   ├── backend/         # NestJS API server
│   │   ├── src/         # Backend source code
│   │   ├── prisma/      # Database schema and migrations
│   │   ├── package.json # Backend dependencies
│   │   └── README.md    # Backend documentation
│   └── frontend/        # React + Vite application
│       ├── src/         # Frontend source code
│       ├── package.json # Frontend dependencies
│       └── README.md    # Frontend documentation
├── package.json         # Root workspace configuration
├── turbo.json           # Turbo build system config
└── pnpm-workspace.yaml  # pnpm workspace definition
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [PostgreSQL](https://www.postgresql.org/) database

## Quick Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cd apps/backend
cp .env.example .env
# Edit .env with your database configuration

# Set up database
npx prisma migrate dev --name init
npx prisma generate

# Start development servers
pnpm dev:backend
pnpm dev:frontend
```

## Environment Variables

### Backend (apps/backend/.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/databaseName"

```

### Database Setup

1. Install PostgreSQL locally or use a cloud service
2. Create a database: `createdb databaseName`
3. Update the `DATABASE_URL` in your `.env` file
4. Run migrations: `cd apps/backend && npx prisma migrate dev`

## How to Run

💡 This project uses [pnpm](https://pnpm.io/) as the package manager for efficient dependency management and workspace support.

```bash
# Install dependencies of backend and frontend
pnpm install

# Set up database (first time only)
cd apps/backend
npx prisma migrate dev --name init

# Run backend in development mode
pnpm dev:backend

# Run frontend in development mode
pnpm dev:frontend
```

- Backend API:
  [http://localhost:3001/api](http://localhost:3001/api)
- Backend Health Check:
  [http://localhost:3001/health](http://localhost:3001/health)
- Frontend:
  [http://localhost:3000](http://localhost:3000)

## Database Management

```bash
# Navigate to backend directory
cd apps/backend

# Run migrations
npx prisma migrate dev

# Open database GUI
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Tech Stack

- **Monorepo**: [Turbo](https://turbo.build/)
- **Backend**: [NestJS](https://nestjs.com/) + [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
