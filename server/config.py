import os

class Config:
    # Required for securely signing session cookies and CSRF protection
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "supersecret")

    # GitHub OAuth App credentials (register your app at https://github.com/settings/developers)
    GITHUB_OAUTH_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
    GITHUB_OAUTH_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")

    # GitHub API base URL
    GITHUB_API_BASE = "https://api.github.com"

    # Redis-based cache configuration for Flask-Caching
    CACHE_TYPE = "redis"
    CACHE_REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
    CACHE_REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
    CACHE_REDIS_DB = int(os.environ.get("REDIS_DB", 0))
    CACHE_DEFAULT_TIMEOUT = 300

    
