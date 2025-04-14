from flask import Blueprint, redirect, url_for, session, jsonify, request
import os
import requests
import logging

auth_bp = Blueprint('auth', __name__)

# GitHub OAuth configuration
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = "http://localhost:5001/api/auth/callback"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a separate blueprint for GitHub callback
github_callback_bp = Blueprint('github_callback', __name__)

@auth_bp.route("/github-login")
def github_login():
    # Direct GitHub OAuth flow without Flask-Dance
    logger.info(f"GitHub Client ID: {GITHUB_CLIENT_ID}")
    logger.info(f"GitHub Redirect URI: {GITHUB_REDIRECT_URI}")
    
    # Use a very simple approach with minimal parameters
    # Removing the redirect_uri parameter to let GitHub use the one registered in the app
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=repo"
    
    logger.info(f"Redirecting to GitHub: {github_auth_url}")
    return redirect(github_auth_url)

@auth_bp.route("/callback")
def callback():
    # Get the authorization code from the request
    code = request.args.get("code")
    logger.info(f"Received callback with code: {code[:5]}..." if code else "No code received")
    
    if not code:
        return jsonify({"error": "No authorization code received"}), 400
    
    # Exchange the code for an access token
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": GITHUB_REDIRECT_URI
    }
    headers = {"Accept": "application/json"}
    
    try:
        logger.info(f"Exchanging code for token with payload: {payload}")
        response = requests.post(token_url, json=payload, headers=headers)
        token_data = response.json()
        
        logger.info(f"Token response status: {response.status_code}")
        logger.info(f"Token response: {token_data}")
        
        if "access_token" not in token_data:
            return jsonify({"error": "Failed to obtain access token", "details": token_data}), 400
        
        # Get user information using the access token
        user_url = "https://api.github.com/user"
        headers = {
            "Authorization": f"token {token_data['access_token']}",
            "Accept": "application/json"
        }
        
        user_response = requests.get(user_url, headers=headers)
        user_data = user_response.json()
        
        # Store user information in session
        session["user"] = {
            "login": user_data.get("login"),
            "name": user_data.get("name"),
            "avatar_url": user_data.get("avatar_url"),
            "token": token_data["access_token"]
        }
        
        # Log the user data for debugging
        logger.info(f"User data: {user_data}")
        
        # Redirect to the frontend with token and user info
        token = token_data["access_token"]
        username = user_data.get("login")
        name = user_data.get("name", username)  # Use login as fallback
        avatar_url = user_data.get("avatar_url", "")
        
        # Create a more complete redirect URL with all user data
        # Use port 80 for Docker environment
        redirect_url = f"http://localhost/auth-callback?token={token}&username={username}&name={name}"
        if avatar_url:
            redirect_url += f"&avatar_url={avatar_url}"
            
        logger.info(f"Redirecting to: {redirect_url}")
        return redirect(redirect_url)
    
    except Exception as e:
        logger.error(f"Error in callback: {str(e)}")
        return jsonify({"error": str(e)}), 500

@github_callback_bp.route("/authorized")
def github_authorized():
    # Get the authorization code from the request
    code = request.args.get("code")
    logger.info(f"Received GitHub callback with code: {code[:5]}..." if code else "No code received")
    
    if not code:
        return jsonify({"error": "No authorization code received"}), 400
    
    # Exchange the code for an access token
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code
    }
    headers = {"Accept": "application/json"}
    
    try:
        logger.info(f"Exchanging code for token with payload: {payload}")
        response = requests.post(token_url, json=payload, headers=headers)
        token_data = response.json()
        
        logger.info(f"Token response status: {response.status_code}")
        logger.info(f"Token response: {token_data}")
        
        if "access_token" not in token_data:
            return jsonify({"error": "Failed to obtain access token", "details": token_data}), 400
        
        # Get user information using the access token
        user_url = "https://api.github.com/user"
        headers = {
            "Authorization": f"token {token_data['access_token']}",
            "Accept": "application/json"
        }
        
        user_response = requests.get(user_url, headers=headers)
        user_data = user_response.json()
        
        # Store user information in session
        session["user"] = {
            "login": user_data.get("login"),
            "name": user_data.get("name"),
            "avatar_url": user_data.get("avatar_url"),
            "token": token_data["access_token"]
        }
        
        # Log the user data for debugging
        logger.info(f"User data: {user_data}")
        
        # Redirect to the frontend with token and user info
        token = token_data["access_token"]
        username = user_data.get("login")
        name = user_data.get("name", username)  # Use login as fallback
        avatar_url = user_data.get("avatar_url", "")
        
        # Create a more complete redirect URL with all user data
        # Use port 80 for Docker environment
        redirect_url = f"http://localhost/auth-callback?token={token}&username={username}&name={name}"
        if avatar_url:
            redirect_url += f"&avatar_url={avatar_url}"
            
        logger.info(f"Redirecting to: {redirect_url}")
        return redirect(redirect_url)
    
    except Exception as e:
        logger.error(f"Error in callback: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/logout", methods=["GET", "POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@auth_bp.route("/profile")
def profile():
    user_data = session.get("user")
    if not user_data:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify(user_data)

@auth_bp.route("/verify")
def verify():
    user_data = session.get("user")
    if not user_data:
        return jsonify({"authenticated": False}), 401
    
    # Log the user data being returned
    logger.info(f"Verify endpoint returning user data: {user_data}")
    
    # Make sure login/username is always included
    if user_data and "login" in user_data:
        # Add username field explicitly for redundancy
        if "username" not in user_data:
            user_data["username"] = user_data["login"]
    
    return jsonify({"authenticated": True, "user": user_data})
