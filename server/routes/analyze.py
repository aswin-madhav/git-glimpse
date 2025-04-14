from flask import Blueprint, request, jsonify, session
from services.github_api import analyze_repo, get_repo_metadata, get_repo_contributors, get_commit_activity, get_commit_frequency
import re

analyze_bp = Blueprint('analyze', __name__)

@analyze_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    repo_url = data.get('repoUrl')
    if not repo_url:
        return jsonify({'error': 'Missing repositry URL'}), 400
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required. Please log in via GitHub."}), 401
    
    try:
        # Extract owner and repo from URL
        parts = repo_url.rstrip('/').split('/')
        owner = parts[-2]
        repo = parts[-1]
        
        # Create a unique repoId
        repo_id = f"{owner}-{repo}"
        
        # Get analysis results
        result = analyze_repo(repo_url, token=token)
        
        # Include the repoId in the response
        result['repoId'] = repo_id
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper function to extract owner and repo from repoId
def extract_owner_repo(repo_id):
    # Special case for codecrafters-io
    if repo_id.startswith('codecrafters-io-'):
        return 'codecrafters-io', repo_id[len('codecrafters-io-'):]
    
    # For other repositories, split by the first hyphen
    parts = repo_id.split('-', 1)
    
    # If we have at least two parts, the first part is likely the owner
    if len(parts) >= 2:
        owner = parts[0]
        # The rest is the repo name with hyphens
        repo = parts[1]
        return owner, repo
    
    # Fallback case
    return None, None

@analyze_bp.route('/repo/metadata/<repo_id>', methods=['GET'])
def get_metadata(repo_id):
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    owner, repo = extract_owner_repo(repo_id)
    if not owner or not repo:
        return jsonify({"error": "Invalid repository ID"}), 400
    
    result = get_repo_metadata(owner, repo, token=token)
    return jsonify(result)

@analyze_bp.route('/repo/contributors/<repo_id>', methods=['GET'])
def get_contributors(repo_id):
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    owner, repo = extract_owner_repo(repo_id)
    if not owner or not repo:
        return jsonify({"error": "Invalid repository ID"}), 400
    
    result = get_repo_contributors(owner, repo, token=token)
    return jsonify(result)

@analyze_bp.route('/repo/commits/activity/<repo_id>', methods=['GET'])
def get_commits_activity(repo_id):
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    owner, repo = extract_owner_repo(repo_id)
    if not owner or not repo:
        return jsonify({"error": "Invalid repository ID"}), 400
    
    result = get_commit_activity(owner, repo, token=token)
    return jsonify(result)

@analyze_bp.route('/repo/commits/frequency/<repo_id>', methods=['GET'])
def get_commits_frequency(repo_id):
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    owner, repo = extract_owner_repo(repo_id)
    if not owner or not repo:
        return jsonify({"error": "Invalid repository ID"}), 400
    
    result = get_commit_frequency(owner, repo, token=token)
    return jsonify(result)