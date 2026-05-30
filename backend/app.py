from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, bcrypt
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# ✅ Correct CORS setup
CORS(app,
     supports_credentials=True,
     resources={r"/*": {"origins": [
         "http://localhost:5173",
         "https://hpppms32-5000.inc1.devtunnels.ms"
     ]}},
     allow_headers=["Content-Type", "Authorization"])

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)

@app.route("/")
def home():
    return "Flask backend is running!"

# ---------------------------
# Register Route
# ---------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(email=email, role=role)
    user.set_password(password)  # bcrypt hash
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"{role} registered successfully"}), 201

# ---------------------------
# Login Route (DB lookup)
# ---------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    app.logger.info(f"Login attempt: {email}, role={role}")

    user = User.query.filter_by(email=email, role=role).first()
    if user and user.check_password(password):
        app.logger.info("Login successful")
        return jsonify({"role": user.role}), 200
    else:
        app.logger.warning("Login failed: invalid credentials")
        return jsonify({"error": "Invalid credentials"}), 401

# ---------------------------
# Admin Dashboard: Create User
# ---------------------------
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

# ---------------------------
# Admin Dashboard: List Users
# ---------------------------
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email, "role": u.role} for u in users])

# ---------------------------
# Admin Dashboard: Delete User
# ---------------------------
@app.route("/delete_user/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

# ---------------------------
# Admin Dashboard: Update User Role
# ---------------------------
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
