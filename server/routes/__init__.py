from .analyze import analyze_bp
from .metadata import metadata_bp
from .contributors import contributors_bp
from .commit_activity import commit_activity_bp
from .commit_frequency import commit_frequency_bp
from .status import status_bp
from .error_log import error_log_bp
from .auth import auth_bp, github_callback_bp

def register_routes(app):
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(github_callback_bp, url_prefix='/api/github')
    app.register_blueprint(analyze_bp, url_prefix='/api')
    app.register_blueprint(status_bp, url_prefix='/api')
    app.register_blueprint(metadata_bp, url_prefix='/api/repo')
    app.register_blueprint(contributors_bp, url_prefix='/api/repo')
    app.register_blueprint(error_log_bp, url_prefix='/api/repo')
    app.register_blueprint(commit_activity_bp, url_prefix='/api/repo/commits')
    app.register_blueprint(commit_frequency_bp, url_prefix='/api/repo/commits')