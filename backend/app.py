from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# ---------------------------
# Config
# ---------------------------
class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://flaskuser:flaskpass@localhost:3306/login_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "supersecretkey"

# ---------------------------
# App + Extensions
# ---------------------------
app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ✅ Correct CORS setup
CORS(app,
     supports_credentials=True,
     resources={r"/*": {"origins": [
         "http://localhost:5173",
         "https://real-time-ai-krgv.vercel.app",
         "https://real-time-egwinx1m5-itz-goks-projects.vercel.app"
     ]}},
     allow_headers=["Content-Type", "Authorization"])

# ---------------------------
# Model
# ---------------------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# ---------------------------
# Routes
# ---------------------------
@app.route("/")
def home():
    return "Flask backend is running!"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"{role} registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    user = User.query.filter_by(email=email, role=role).first()
    if user and user.check_password(password):
        return jsonify({"role": user.role}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/create_user", methods=["POST"])
def create_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"{role} created successfully!"}), 201

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email, "role": u.role} for u in users])

@app.route("/delete_user/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@app.route("/update_user/<int:id>", methods=["PUT"])
def update_user(id):
    data = request.json
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.role = data.get("role", user.role)
    db.session.commit()
    return jsonify({"message": "User updated"}), 200

# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
