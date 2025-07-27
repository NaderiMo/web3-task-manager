# web3-task-manager

Technical Task - Web3 Authenticated Task Manager

## Repository Structure

This project uses a Turbo monorepo structure to manage both backend and frontend applications:

```
web3-task-manager/
├── apps/
│   ├── backend/         # NestJS API server
│   │   ├── src/         # Backend source code
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

## How to Run

💡 This project uses [pnpm](https://pnpm.io/) as the package manager for efficient dependency management and workspace support.

```bash
# Install dependencies of backend and frontend
pnpm install
# Run backend in development mode
pnpm dev:backend
# Check if backend is running
pnpm dev:frontend
```

- Backend API:
  [http://localhost:3001/api](http://localhost:3001/api)
- Backend Health Check:
  [http://localhost:3001/health](http://localhost:3001/health)
- Frontend:
  [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Monorepo**: [Turbo](https://turbo.build/)
- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
