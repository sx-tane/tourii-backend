# 🐳 Docker Setup for Tourii Backend

This guide explains how to set up the local PostgreSQL database using Docker for the Tourii backend development environment.

## 📦 Container Configuration

- **Database**: PostgreSQL 15 Alpine
- **Ports**: 7442:5432 (local:container)
- **Database**: `tourii_backend`
- **Username/Password**: `touriibackenddev`

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## 🚀 Initial Setup

1. **Navigate to the docker directory**

   ```bash
   cd etc/docker
   ```

2. **Start the container** (creates and starts in detached mode)

   ```bash
   docker-compose up -d
   ```

3. **Verify the container is running** (STATUS should show "Up")
   ```bash
   docker ps
   ```

## 🔧 Common Commands

### Container Management

```bash
# Check running containers
docker ps

# Check all containers (running and stopped)
docker ps -a

# Start containers (if already created)
docker-compose start

# Stop containers (keeps container for restart)
docker-compose stop

# Stop and remove containers
docker-compose down
```

### Database Operations

```bash
# View container logs
docker-compose logs db

# Connect to PostgreSQL inside container
docker-compose exec db psql -U touriibackenddev -d tourii_backend

# Backup database
docker-compose exec db pg_dump -U touriibackenddev tourii_backend > backup.sql

# Restore database
docker-compose exec -T db psql -U touriibackenddev tourii_backend < backup.sql
```

## 🌐 Database Connection

Once running, connect to the database using:

- **Host**: `localhost`
- **Port**: `7442`
- **Database**: `tourii_backend`
- **Username**: `touriibackenddev`
- **Password**: `touriibackenddev`

**Connection URL**:

```
postgresql://touriibackenddev:touriibackenddev@localhost:7442/tourii_backend
```

## 🗃️ Data Persistence

Database data is persisted in Docker volumes, so your data will remain intact between container restarts.

## 🔧 Troubleshooting

### Port Already in Use

If port 7442 is already in use:

```bash
# Check what's using the port
lsof -i :7442

# Modify docker-compose.yml to use different port
# Change "7442:5432" to "7443:5432" (or any available port)
```

### Container Won't Start

```bash
# Check detailed logs
docker-compose logs

# Remove and recreate containers
docker-compose down -v
docker-compose up -d
```

### Reset Database

```bash
# Stop and remove everything (including volumes)
docker-compose down -v

# Restart fresh
docker-compose up -d
```
