#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
from flask_login import login_user, logout_user, current_user, login_required   


# Local imports
from config import app, db, api, login_manager, bcrypt
# Add your model imports
from models import User, Topic, TutorService, Request

# Views go here!

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return {"message": "Skills-Hab API is running"}


class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        name = data.get("name")
        password = data.get("password")

        if not name or not password:
            return {"error": "name and password are required"}, 400

        user = User.query.filter_by(name=name).first()

        # NOTE: this is a temporary plain-text check.
        # Replace with bcrypt-based password verification later.
        if not user or user.password != password:
            return {"error": "Invalid credentials"}, 401

        login_user(user)
        return {"id": user.id, "name": user.name, "role": user.role}, 200
    

class Signup(Resource):
    def post(self):
        data = request.get_json() or {}
        name = data.get("name")
        password = data.get("password")
        role = data.get("role")

        if not name or not password or not role:
            return {"error": "name, password, role are required"}, 400

        if role not in ("student", "tutor"):
            return {"error": "role must be 'student' or 'tutor'"}, 400

        existing_user = User.query.filter_by(name=name).first()
        if existing_user:
            return {"error": "name is already taken"}, 409

        user = User(name=name, password=password, role=role)
        db.session.add(user)

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"error": "could not create user"}, 500

        # optional: auto-login right after signup
        login_user(user)

        return {"id": user.id, "name": user.name, "role": user.role}, 201


class CheckSession(Resource):
    def get(self):
        if not current_user.is_authenticated:
            return {"error": "Not Authorized"}, 401
        return {"id": current_user.id, "name": current_user.name, "role": current_user.role}, 200


class Logout(Resource):
    def delete(self):
        logout_user()
        return {}, 204


api.add_resource(Login, "/login")
api.add_resource(Signup, "/signup")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Logout, "/logout")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

