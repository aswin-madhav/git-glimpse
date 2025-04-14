from flask import Blueprint, request, jsonify, session
from services.github_api import get_commit_activity

commit_activity_bp = Blueprint('commit_activity', __name__)

@commit_activity_bp.route('/activity', methods=['GET'])
def commit_activity():
    owner = request.args.get('owner')
    repo = request.args.get('repo')
    if not owner or not repo:
        return jsonify({'error': 'Missing owner or repo parameter'}), 400
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required. Please log in via GitHub."}), 401
    result = get_commit_activity(owner, repo, token=token)
    return jsonify(result)
