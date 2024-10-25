# Ideanest Challenge

This project is a NestJS application designed to work with MongoDB and Redis. It uses Docker for containerization and `docker-compose` for orchestration.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/the-sabra/ideanest_challenge.git
cd ideanest_challenge
``` 

2. Install dependencies:

```sh
npm install
```

## Usage

To start the application in development mode:

```sh
npm run start:dev
```

To build the application:

```sh
npm run build
```

To start the application in production mode:

```sh
npm run start:prod
```

## Docker

This project uses Docker to containerize the application and `docker-compose` to manage the services.

### Build and Run

1. Build the Docker images and start the containers:

```sh
docker-compose up --build
```

2. The application will be available at `http://localhost:8080`.

### Stop

To stop the containers:

```sh
docker-compose down
```

## Environment Variables

The application uses environment variables defined in the `.env.docker` file. Here are the key variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES`: Access token expiration time
- `JWT_REFRESH_EXPIRATION_TIME_IN_MINUTES`: Refresh token expiration time
- `JWT_SECRET`: Secret key for JWT
- `JWT_REFRESH_SECRET`: Secret key for refresh JWT
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `CACHE_TTL`: Cache time-to-live

## Project Structure

- `src/`: Source code of the application
- `dist/`: Compiled output (ignored in `.gitignore`)
- `DockerFile`: Docker configuration for the application
- `docker-compose.yml`: Docker Compose configuration
- `.env.docker`: Environment variables for Docker
- `.gitignore`: Files and directories to be ignored by Git

## API Documentation

The application includes Swagger documentation for the API. You can access the Swagger UI at the following route:

```
http://localhost:8080/docs
```

## Additional Information

- The application uses MongoDB for data storage and Redis for caching.
- The `.dockerignore` file specifies files and directories to be ignored by Docker.

For more details, refer to the individual configuration files and the source code.

