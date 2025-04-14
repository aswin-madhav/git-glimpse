<div align="center">

# 🔍 GitGlimpse

*Powerful GitHub Repository Analytics and Visualization*

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)

</div>

## 📋 Overview

GitGlimpse is a web application that provides insights and analytics for GitHub repositories. It allows users to authenticate with GitHub, analyze repositories, and visualize data such as commit activity, language distribution, and contributor statistics.

## ✨ Features

- **GitHub OAuth Integration** - Secure authentication with your GitHub account
- **Repository Analytics** - Comprehensive analysis of any GitHub repository
- **Interactive Visualizations** - Beautiful charts for commit activity and code distribution
- **Contributor Insights** - Understand who contributes to repositories and how
- **Language Breakdown** - See which programming languages are used in repositories
- **Responsive Design** - Optimized for both desktop and mobile devices

## 🛠️ Tech Stack

<table>
  <tr>
    <td valign="top" width="50%">
      <h3>Frontend</h3>
      <ul>
        <li>React</li>
        <li>Material UI</li>
        <li>Chart.js</li>
        <li>Axios</li>
        <li>React Router</li>
      </ul>
    </td>
    <td valign="top" width="50%">
      <h3>Backend</h3>
      <ul>
        <li>Flask</li>
        <li>Flask-Dance (OAuth)</li>
        <li>Flask-Caching</li>
        <li>Flask-Limiter</li>
        <li>Redis for caching</li>
      </ul>
    </td>
  </tr>
</table>

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) - Container platform
- [Docker Compose](https://docs.docker.com/compose/install/) - Multi-container orchestration
- [GitHub OAuth App](https://github.com/settings/developers) - For authentication credentials

## 🚀 Setup & Installation

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

```env
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

| Service | Description | Access URL |
|---------|-------------|------------|
| Client | React frontend | http://localhost |
| Server | Flask backend API | http://localhost:5001 |
| Redis | Caching service | localhost:6379 |

### 4. Access the application

Open your browser and navigate to:

```
http://localhost
```

## 💻 Development

### Running individual services

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

## ⚠️ Troubleshooting

<details>
<summary><b>404 Not Found for auth-callback</b></summary>
<ul>
  <li>Make sure all containers are running (<code>docker ps</code>)</li>
  <li>Check server logs for authentication errors (<code>docker-compose logs server</code>)</li>
  <li>Verify GitHub OAuth callback URL is configured correctly</li>
</ul>
</details>

<details>
<summary><b>Error loading commit activity</b></summary>
<ul>
  <li>Some repositories may not have enough commit history</li>
  <li>Try analyzing a repository with more activity</li>
  <li>Check if you've exceeded GitHub API rate limits</li>
</ul>
</details>

<details>
<summary><b>Container not starting</b></summary>
<ul>
  <li>Ensure Docker daemon is running</li>
  <li>Check for port conflicts with existing services</li>
  <li>Verify environment variables are set correctly</li>
</ul>
</details>

## 📄 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by [aswin-madhav](https://github.com/aswin-madhav)

</div>
