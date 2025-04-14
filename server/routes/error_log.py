from flask import Blueprint, jsonify
from services.github_api import get_error_logs

error_log_bp = Blueprint('error_log', __name__)

@error_log_bp.route('/error-log', methods=['GET'])
def error_log():
    result = get_error_logs()
    return jsonify(result)
