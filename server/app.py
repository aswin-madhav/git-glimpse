from flask import Flask
from config import Config
from routes import register_routes
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    cache = Cache(app)
    app.cache = cache

    limiter = Limiter(app, key_func=get_remote_address, default_limits=["100 per hour"])
    app.limiter = limiter

    register_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()
    # Listen on all interfaces (0.0.0.0) when running in Docker
    app.run(host='0.0.0.0', debug=True, port=5001)