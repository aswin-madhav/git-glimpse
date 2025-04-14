from flask import Blueprint, jsonify, session
from services.github_api import get_status

status_bp = Blueprint('status', __name__)

@status_bp.route('/status', methods=['GET'])
def status():
    token = session.get("user", {}).get("token")
    if not token:
        return jsonify({"error": "Authentication required. Please log in via GitHub."}), 401
    result = get_status(token=token)
    return jsonify(result)
