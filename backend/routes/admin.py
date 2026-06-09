from flask import Blueprint, jsonify, request
from datetime import datetime

from models import (
    db,
    User,
    Activity,
    Notification
)

admin_bp = Blueprint(
    "admin",
    __name__
)

# =====================================================
# Create User
# =====================================================

@admin_bp.route("/create_user", methods=["POST"])
def create_user():

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

    user = User(
        email=email,
        role=role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # Activity Log
    user.activities.append(
        Activity(
            action="Account created by admin"
        )
    )

    # Welcome Notification
    user.notifications.append(
        Notification(
            message="Your account has been created by an administrator."
        )
    )

    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "id": user.id,
        "email": user.email,
        "role": user.role
    }), 201


# =====================================================
# Get All Users
# =====================================================

@admin_bp.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()

    return jsonify([
        {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "last_login": (
                user.last_login.isoformat()
                if user.last_login
                else None
            )
        }
        for user in users
    ]), 200


# =====================================================
# Delete User
# =====================================================

@admin_bp.route("/delete_user/<int:id>", methods=["DELETE"])
def delete_user(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "User deleted successfully"
    }), 200