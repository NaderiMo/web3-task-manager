# Web3 Task Manager

A modern task management application with Web3 authentication using wallet signatures.

## Features

- 🔐 **Web3 Authentication**: Connect and authenticate using MetaMask or any Web3 wallet
- ✍️ **Message Signing**: Secure authentication through wallet message signing
- 🎫 **JWT Tokens**: Session management with JWT tokens
- 🛡️ **Protected Routes**: Secure API endpoints requiring authentication
- 🎨 **Modern UI**: Beautiful, responsive interface
- 📱 **Mobile Friendly**: Works on all devices

## Tech Stack

### Frontend

- React 19 with TypeScript
- Reown SDK for Web3 integration
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

- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task

## Project Structure

```
web3-task-manager/
├── apps/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── contexts/  # React contexts
│   │   │   ├── components/ # React components
│   │   │   └── ...
│   │   └── ...
│   └── backend/           # NestJS API
│       ├── src/
│       │   ├── auth/      # Authentication module
│       │   ├── tasks/     # Tasks module
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
