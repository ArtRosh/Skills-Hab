from config import ma
from models import User, Topic, TutorService, Request


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        exclude = ("password",)

class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        include_relationships = True

class TutorServiceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TutorService
        load_instance = True
        include_relationships = True

class RequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Request
        load_instance = True
        include_relationships = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)
topic_schema = TopicSchema()
topics_schema = TopicSchema(many=True)
tutor_service_schema = TutorServiceSchema()
tutor_services_schema = TutorServiceSchema(many=True)
request_schema = RequestSchema()
requests_schema = RequestSchema(many=True) 