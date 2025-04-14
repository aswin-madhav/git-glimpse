from flask import session, request, jsonify, Blueprint
from services.github_api import get_repo_metadata

metadata_bp = Blueprint('metadata', __name__)

@metadata_bp.route('/metadata', methods=['GET'])
def metadata():
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required. Please log in via GitHub."}), 401

    owner = request.args.get('owner')
    repo = request.args.get('repo')
    if not owner or not repo:
        return jsonify({'error': 'Missing owner or repo parameter'}), 400

    result = get_repo_metadata(owner, repo, token=token)
    return jsonify(result)
