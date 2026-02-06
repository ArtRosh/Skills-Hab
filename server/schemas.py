# server/schemas.py

from marshmallow import fields
from config import ma
from models import User, Topic, TutorService, Request


# -------------------------
# Requests
# -------------------------

class RequestSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Request
        load_instance = True

    id = ma.auto_field()
    status = ma.auto_field()
    description = ma.auto_field()

    student_id = ma.auto_field()
    tutor_service_id = ma.auto_field()


request_schema = RequestSchema()
requests_schema = RequestSchema(many=True)


# -------------------------
# Tutor Services
# -------------------------

class TutorServiceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = TutorService
        load_instance = True

    id = ma.auto_field()
    rate = ma.auto_field()
    description = ma.auto_field()

    tutor_id = ma.auto_field()
    topic_id = ma.auto_field()


tutor_service_schema = TutorServiceSchema()
tutor_services_schema = TutorServiceSchema(many=True)


# TutorService + its requests
class TutorServiceWithRequestsSchema(ma.SQLAlchemySchema):
    class Meta:
        model = TutorService
        load_instance = True

    id = ma.auto_field()
    rate = ma.auto_field()
    description = ma.auto_field()
    tutor_id = ma.auto_field()
    topic_id = ma.auto_field()

    requests = fields.Nested(RequestSchema, many=True)


tutor_service_with_requests_schema = TutorServiceWithRequestsSchema()
tutor_services_with_requests_schema = TutorServiceWithRequestsSchema(many=True)


# -------------------------
# Topics
# -------------------------

class TopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Topic
        load_instance = True

    id = ma.auto_field()
    topic = ma.auto_field()
    description = ma.auto_field()


topic_schema = TopicSchema()
topics_schema = TopicSchema(many=True)


# Topic + tutor services (+ requests under each service)
class TopicWithServicesSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Topic
        load_instance = True

    id = ma.auto_field()
    topic = ma.auto_field()
    description = ma.auto_field()

    tutor_services = fields.Nested(TutorServiceWithRequestsSchema, many=True)


topic_with_services_schema = TopicWithServicesSchema()
topics_with_services_schema = TopicWithServicesSchema(many=True)


# -------------------------
# Users
# -------------------------

class TutorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()

    # Tutor view: show tutor services, each includes requests; and topic info via nested topic
    tutor_services = fields.Method("get_tutor_services")

    def get_tutor_services(self, user_obj):
        # user_obj.tutor_services already exists for tutors
        return tutor_services_with_requests_schema.dump(user_obj.tutor_services)


tutor_schema = TutorSchema()
tutors_schema = TutorSchema(many=True)


class StudentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()

    # Student view: show student's requests (and optionally what they requested)
    requests = fields.Nested(RequestSchema, many=True)


student_schema = StudentSchema()
students_schema = StudentSchema(many=True)


# -------------------------
# Optional "rich" request output
# -------------------------
# If you want Request JSON to include tutor + topic info without extra fetches on frontend,
# use this schema instead of RequestSchema in the student/tutor outputs.

# class RequestDetailSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = Request
#         load_instance = True

#     id = ma.auto_field()
#     status = ma.auto_field()
#     description = ma.auto_field()

#     student_id = ma.auto_field()
#     tutor_service_id = ma.auto_field()

#     tutor_id = fields.Method("get_tutor_id")
#     topic_id = fields.Method("get_topic_id")
#     topic = fields.Method("get_topic_title")
#     tutor_name = fields.Method("get_tutor_name")

#     def get_tutor_id(self, r_obj):
#         return r_obj.tutor_service.tutor_id

#     def get_topic_id(self, r_obj):
#         return r_obj.tutor_service.topic_id

#     def get_topic_title(self, r_obj):
#         return r_obj.tutor_service.topic.topic

#     def get_tutor_name(self, r_obj):
#         return r_obj.tutor_service.tutor.name


# request_detail_schema = RequestDetailSchema()
# requests_detail_schema = RequestDetailSchema(many=True)