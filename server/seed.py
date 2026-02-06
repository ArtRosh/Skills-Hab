#!/usr/bin/env python3

from faker import Faker

from config import app, db, bcrypt
from models import User, Topic, TutorService, Request

fake = Faker()


def run_seed():
    with app.app_context():
        print("Starting seed...")

        # Wipe tables (order matters because of FKs)
        Request.query.delete()
        TutorService.query.delete()
        Topic.query.delete()
        User.query.delete()
        db.session.commit()

        # ---- Topics ----
        topic_names = [
            "JavaScript Basics",
            "React Fundamentals",
            "Python Basics",
            "Flask APIs",
            "SQL & Databases",
            "Data Structures",
        ]

        topics = []
        for name in topic_names:
            topics.append(Topic(topic=name, description=fake.sentence(nb_words=10)))

        db.session.add_all(topics)
        db.session.commit()

        # ---- Users (known logins) ----
        tutor_anna = User(
            name="tutor_anna",
            password=bcrypt.generate_password_hash("111").decode("utf-8"),
            role="tutor",
        )
        tutor_mike = User(
            name="tutor_mike",
            password=bcrypt.generate_password_hash("222").decode("utf-8"),
            role="tutor",
        )
        student_artem = User(
            name="student_artem",
            password=bcrypt.generate_password_hash("333").decode("utf-8"),
            role="student",
        )
        student_john = User(
            name="student_john",
            password=bcrypt.generate_password_hash("444").decode("utf-8"),
            role="student",
        )

        db.session.add_all([tutor_anna, tutor_mike, student_artem, student_john])
        db.session.commit()

        # ---- Tutor services (tutor <-> topic) ----
        anna_js = TutorService(
            tutor_id=tutor_anna.id,
            topic_id=topics[0].id,
            rate=40,
            description="Beginner friendly",
        )
        anna_react = TutorService(
            tutor_id=tutor_anna.id,
            topic_id=topics[1].id,
            rate=55,
            description="React help",
        )
        mike_python = TutorService(
            tutor_id=tutor_mike.id,
            topic_id=topics[2].id,
            rate=35,
            description="Python basics",
        )
        mike_flask = TutorService(
            tutor_id=tutor_mike.id,
            topic_id=topics[3].id,
            rate=60,
            description="Flask backend",
        )

        services = [anna_js, anna_react, mike_python, mike_flask]
        db.session.add_all(services)
        db.session.commit()

        # ---- Requests (IMPORTANT: use student_id + tutor_service_id) ----
        requests = [
            # Requests for Mike's services (Python / Flask)
            Request(
                status="pending",
                description="Need help with variables and loops",
                student_id=student_artem.id,
                tutor_service_id=mike_python.id,
            ),
            Request(
                status="accepted",
                description="Help me build a simple Flask REST API",
                student_id=student_john.id,
                tutor_service_id=mike_flask.id,
            ),
            # Requests for Anna's services (JS / React)
            Request(
                status="pending",
                description="Explain closures and scope",
                student_id=student_john.id,
                tutor_service_id=anna_js.id,
            ),
            Request(
                status="completed",
                description="State + props practice",
                student_id=student_artem.id,
                tutor_service_id=anna_react.id,
            ),
        ]

        db.session.add_all(requests)
        db.session.commit()

        print("Seed done.")
        print("Logins to test:")
        print("  tutor_anna / 111")
        print("  tutor_mike / 222")
        print("  student_artem / 333")
        print("  student_john / 444")


if __name__ == "__main__":
    run_seed()