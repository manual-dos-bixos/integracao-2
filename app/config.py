import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('sqlalchemy_database_uri')
    SQLALCHEMY_TRACK_MODIFICATIONS = False