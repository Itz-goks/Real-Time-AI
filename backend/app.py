from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt
from models import User, Activity, Notification

from routes.auth import auth_bp
from routes.user import user_bp
from routes.admin import admin_bp
from routes.lead_routes import lead_bp
from routes.call_notes_routes import call_notes_bp

print("CALL NOTES BLUEPRINT LOADED")

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)

CORS(
    app,
    origins=["http://localhost:5173"],
    methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(lead_bp)
app.register_blueprint(call_notes_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
