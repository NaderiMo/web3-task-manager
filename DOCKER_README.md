# Web3 Task Manager - Docker Setup

This document provides instructions for running the Web3 Task Manager application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB of available RAM
- At least 10GB of available disk space

## Project Structure

```
web3-task-manager/
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
├── apps/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   └── ...
│   └── frontend/
│       ├── Dockerfile
│       ├── .dockerignore
│       ├── nginx.conf
│       └── ...
```

## Services

The application consists of the following services:

1. **PostgreSQL** - Database for storing user data and tasks
2. **Redis** - Cache and queue management for Bull
3. **Backend** - NestJS API server
4. **Frontend** - React application with Vite

## Quick Start (Development)

### 1. Clone and Navigate

```bash
cd web3-task-manager
```

### 2. Start Development Environment

```bash
# Start all services
docker-compose up -d

# Or start with logs
docker-compose up
```

### 3. Initialize Database

```bash
# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Production Deployment

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Frontend
VITE_API_URL=http://your-domain.com
```

### 2. Start Production Environment

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# Initialize database
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### 3. Access Production Application

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000

## Development Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec postgres psql -U postgres -d web3_task_manager
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Reset database
docker-compose exec backend npx prisma migrate reset

# View database
docker-compose exec backend npx prisma studio
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000

   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database Connection Issues**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres

   # Check logs
   docker-compose logs postgres
   ```

3. **Frontend Build Issues**

   ```bash
   # Clear node_modules and rebuild
   docker-compose exec frontend rm -rf node_modules
   docker-compose build frontend
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## Environment Variables

### Backend Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT token signing

### Frontend Environment Variables

- `VITE_API_URL`: Backend API URL

### Database Environment Variables

- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## Performance Optimization

### Development

- Use volume mounts for hot reloading
- Enable source maps for debugging
- Use development mode for faster builds

### Production

- Multi-stage builds for smaller images
- Nginx for serving static files
- Gzip compression enabled
- Security headers configured
- Proper caching strategies

## Security Considerations

1. **Change Default Passwords**: Update `POSTGRES_PASSWORD` and `JWT_SECRET`
2. **Use Environment Variables**: Never hardcode secrets
3. **Network Isolation**: Services communicate through Docker network
4. **Health Checks**: Monitor service health
5. **Regular Updates**: Keep base images updated

## Monitoring

### Health Checks

All services include health checks:

- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- Backend: Built-in NestJS health checks
- Frontend: Nginx status

### Logs

```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres web3_task_manager > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres web3_task_manager < backup.sql
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v web3-task-manager_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v web3-task-manager_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Support

For issues related to:

- **Docker**: Check Docker and Docker Compose versions
- **Database**: Verify PostgreSQL connection and migrations
- **Frontend**: Check Vite build process and nginx configuration
- **Backend**: Verify NestJS application and Prisma setup
