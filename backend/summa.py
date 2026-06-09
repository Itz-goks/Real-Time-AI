from app import app, db   # import your Flask app and db
from models import User   # import your User model

def seed_users():
    with app.app_context():   # <-- this is the fix
        # Create a test user
        user = User(email="test@example2.com", role="user")
        user.set_password("password123")

        # Create an admin
        admin = User(email="admin@example3.com", role="admin")
        admin.set_password("admin123")

        db.session.add(user)
        db.session.add(admin)
        db.session.commit()

        print("Seeded users:", user.id, admin.id)

if __name__ == "__main__":
    seed_users()
