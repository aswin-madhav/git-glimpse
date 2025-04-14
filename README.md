# GitGlimpse

GitGlimpse is a web application that provides insights and analytics for GitHub repositories. It allows users to authenticate with GitHub, analyze repositories, and visualize data such as commit activity, language distribution, and contributor statistics.

![GitGlimpse Logo](client/public/vite.svg)

## Features

- GitHub OAuth authentication
- Repository analysis and visualization
- Commit activity charts
- Language distribution
- Contributor statistics
- Responsive design for desktop and mobile

## Tech Stack

### Frontend
- React
- Material UI
- Chart.js
- Axios
- React Router

### Backend
- Flask
- Flask-Dance (OAuth)
- Flask-Caching
- Flask-Limiter
- Redis for caching

## Prerequisites

Before running the application, make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- GitHub OAuth application credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/git-glimpse.git
cd git-glimpse
```

### 2. Configure environment variables

Create a `.env` file in the server directory:

```bash
cp server/.env.example server/.env
```

Edit the `.env` file and add your GitHub OAuth credentials:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FLASK_SECRET_KEY=your_random_secret_key
```

### 3. Run with Docker Compose

Build and start the containers:

```bash
docker-compose up -d
```

This will start three containers:
- Client (React frontend) - accessible at http://localhost
- Server (Flask backend) - accessible at http://localhost:5001
- Redis (for caching) - running on port 6379

### 4. Access the application

Open your browser and navigate to:

```
http://localhost
```

## Development

### Running individual services

To run only specific services:

```bash
# Run only the backend
docker-compose up -d server

# Run only the frontend
docker-compose up -d client

# Run only Redis
docker-compose up -d redis
```

### Viewing logs

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs client
docker-compose logs server
```

### Rebuilding containers after changes

```bash
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild and restart a specific service
docker-compose up -d --build server
```

## Troubleshooting

### Common issues

1. **404 Not Found for auth-callback**
   - Make sure all containers are running
   - Check server logs for authentication errors

2. **Error loading commit activity**
   - Some repositories may not have enough commit history
   - Try analyzing a repository with more activity

3. **Container not starting**
   - Ensure Docker daemon is running
   - Check for port conflicts with existing services

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
