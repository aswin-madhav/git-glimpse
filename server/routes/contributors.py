from flask import Blueprint, request, jsonify, session
from services.github_api import get_repo_contributors

contributors_bp = Blueprint('contributors', __name__)

@contributors_bp.route('/contributors', methods=['GET'])
def contributors():
    owner = request.args.get('owner')
    repo = request.args.get('repo')
    if not owner or not repo:
        return jsonify({'error': 'Missing owner or repo parameter'}), 400
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required. Please log in via GitHub."}), 401
    result = get_repo_contributors(owner, repo, token=token)
    return jsonify(result)