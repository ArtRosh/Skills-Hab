import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import DataContext from "../context/DataContext";

const validationSchema = Yup.object().shape({
  rate: Yup.number()
    .required("Rate is required")
    .positive("Rate must be positive")
    .typeError("Rate must be a number"),
  description: Yup.string(),
});

function TutorServiceEdit() {
  const { currentUser, setCurrentUser } = useContext(DataContext);
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const serviceId_int = Number(serviceId);
  
  const topic = currentUser.topics.find(t => t.tutor_services.find(s => s.id === serviceId_int));
  
  const service = topic?.tutor_services.find(s => s.id === serviceId_int);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: service
      ? {
          rate: String(service.rate),
          description: service.description || "",
        }
      : {
          rate: "",
          description: "",
        },
    validationSchema,
    onSubmit: (values) => {
      fetch(`/tutor_services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rate: Number(values.rate),
          description: values.description,
        }),
      })
      .then(res => res.json())
      .then((data) => {
        const adjustService = data;
        const adjustTopic = { ...topic, tutor_services: topic.tutor_services.map(s => s.id === adjustService.id ? adjustService : s) };
        const adjustTopics = currentUser.topics.map(t => t.id === adjustTopic.id ? adjustTopic : t);
        const adjustCurrentUser = { ...currentUser, topics: adjustTopics };
        setCurrentUser(adjustCurrentUser);
        
        navigate("/topics");
      });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Delete this service?")) {
      fetch(`/tutor_services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      })
      .then(() => {
        const adjustTopic = { ...topic, tutor_services: topic.tutor_services.filter(s => s.id !== serviceId_int) };
        const adjustTopics = adjustTopic.tutor_services.length > 0 
          ? currentUser.topics.map(t => t.id === adjustTopic.id ? adjustTopic : t)
          : currentUser.topics.filter(t => t.id !== adjustTopic.id);
        const adjustCurrentUser = { ...currentUser, topics: adjustTopics };
        setCurrentUser(adjustCurrentUser);
        
        navigate("/topics");
      });
    }
  };

  if (!service) return <p>Loading...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">Edit: {service.topic?.topic}</h2>

      <div className="card p-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="rate">
              Rate ($/hour)
            </label>
            <input
              id="rate"
              name="rate"
              type="number"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rate}
            />
            {formik.touched.rate && formik.errors.rate && (
              <p className="text-danger">{formik.errors.rate}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-danger">{formik.errors.description}</p>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Service
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TutorServiceEdit;