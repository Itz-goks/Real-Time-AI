import os

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://flaskuser:flaskpass@localhost:3306/login_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "supersecretkey"
