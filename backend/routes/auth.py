from datetime import datetime
import email
from flask import Blueprint, request, jsonify
from routes import user
from models import db, User, Activity, Notification


auth_bp = Blueprint(
    "auth",
    __name__
)

# =====================================================
# Register
# =====================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user").lower()

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "message": "Password must be at least 6 characters"
        }), 400

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "message": "User already exists"
        }), 400

    nickname = email.split("@")[0]

    user = User(
        email=email,
        nickname=nickname,
        role=role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # Activity Log
    user.activities.append(
        Activity(
            action="Created account"
        )
    )

    # Welcome Notification
    user.notifications.append(
        Notification(
            message="Welcome to Real-Time AI Sales Assistant!"
        )
    )

    db.session.commit()

    return jsonify({
        "message": "Registration successful"
    }), 201


# =====================================================
# Login
# =====================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password:
        return jsonify({
            "message": "Email and password required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if role:
        role = role.lower()

    if role and user.role.lower() != role:
        return jsonify({
            "message": "Invalid role"
        }), 403

    if not user.check_password(password):
        return jsonify({
            "message": "Invalid password"
        }),
        401
    print("Received role:", role)
    print("Database role:", user.role),401

    # Update Last Login
    user.last_login = datetime.utcnow()

    # Activity Log
    user.activities.append(
        Activity(
            action="Logged into system"
        )
    )

    # Notification
    user.notifications.append(
        Notification(
            message="You logged in successfully."
        )
    )

    db.session.commit()

    return jsonify({
        "message": "Login successful",
        "id": user.id,
        "email": user.email,
        "role": user.role
    }), 200