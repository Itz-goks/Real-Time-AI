from flask import Blueprint, jsonify, request
from models import db, User, Activity, Notification
from datetime import datetime

user_bp = Blueprint(
    "user",
    __name__
)

# =====================================================
# User Profile
# =====================================================

@user_bp.route("/user/profile/<int:id>", methods=["GET"])
def get_profile(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "id": user.id,
        "nickname": user.nickname,
        "email": user.email,
        "role": user.role,
        "last_login": (
            user.last_login.isoformat()
            if user.last_login
            else None
        )
    })


# =====================================================
# Update Profile
# =====================================================

@user_bp.route("/user/update/<int:id>", methods=["PUT"])
def update_profile(id):

    # Get user by ID
    user = db.session.get(User, id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    # Update email
    if "email" in data:

        existing = User.query.filter_by(
            email=data["email"]
        ).first()

        if existing and existing.id != user.id:
            return jsonify({
                "message": "Email already exists"
            }), 400

        user.email = data["email"]

    # Update password
    if "password" in data:

        if len(data["password"]) < 6:
            return jsonify({
                "message": "Password must be at least 6 characters"
            }), 400

        user.set_password(data["password"])

    # Log activity
    activity = Activity(
        user_id=user.id,
        action="Updated profile information"
    )

    db.session.add(activity)

    # Save all changes
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully"
    }), 200

#Activity Log Route

@user_bp.route("/user/activity/<int:user_id>", methods=["GET"])
def get_user_activity(user_id):

    activities = Activity.query.filter_by(
        user_id=user_id
    ).order_by(
        Activity.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": activity.id,
            "action": activity.action,
            "created_at": activity.created_at.isoformat()
        }
        for activity in activities
    ])

#Notifications Route

@user_bp.route("/user/notifications/<int:user_id>", methods=["GET"])
def get_notifications(user_id):

    notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": notification.id,
            "message": notification.message,
            "is_read": notification.is_read,
            "created_at": notification.created_at.isoformat()
        }
        for notification in notifications
    ])

# User Dashboard Route

@user_bp.route("/dashboard/<int:id>", methods=["GET"])
def dashboard(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    activity_count = Activity.query.filter_by(
        user_id=id
    ).count()

    recent_activities = Activity.query.filter_by(
        user_id=id
    ).order_by(
        Activity.created_at.desc()
    ).limit(5).all()

    return jsonify({
        "id": user.id,
        "nickname": user.nickname,
        "email": user.email,
        "role": user.role,
        "last_login": (
            user.last_login.isoformat()
            if user.last_login
            else None
        ),
        "activity_count": activity_count,

        "recent_activities": [
            {
                "action": activity.action,
                "created_at": activity.created_at.isoformat()
            }
            for activity in recent_activities
        ]
    }), 200

# Update User Settings

@user_bp.route("/user/settings/<int:id>", methods=["PUT"])
def update_settings(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json()

    if "nickname" in data:
        user.nickname = data["nickname"]

    if "email" in data:
        user.email = data["email"]

    if data.get("password"):

        if len(data["password"]) < 6:
            return jsonify({
                "message": "Password must be at least 6 characters"
            }), 400

        user.set_password(data["password"])

    db.session.commit()

    return jsonify({
        "message": "Settings updated successfully"
    }), 200