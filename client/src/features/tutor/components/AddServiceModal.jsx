import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function AddServiceModal({ isOpen, onClose, allTopics, currentUser, setCurrentUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState(allTopics);
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  const validationSchema = Yup.object().shape({
    topicId: Yup.string().required("Topic is required"),
    rate: Yup.number()
      .required("Rate is required")
      .positive("Rate must be positive")
      .typeError("Rate must be a number"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      topicId: "",
      rate: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setError("");
      setIsLoading(true);

      fetch("/tutor_services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          topic_id: Number(values.topicId),
          rate: Number(values.rate),
          description: values.description,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to create service");
          return res.json();
        })
        .then((newService) => {
          const topic = currentUser.topics.find((t) => t.id === Number(values.topicId));
          if (topic) {
            const updatedTopic = { ...topic, tutor_services: [...topic.tutor_services, newService] };
            const updatedTopics = currentUser.topics.map((t) => t.id === updatedTopic.id ? updatedTopic : t);
            setCurrentUser({ ...currentUser, topics: updatedTopics });
          } else {
            const selectedTopic = topics.find((t) => t.id === Number(values.topicId));
            const newTopicEntry = {
              id: selectedTopic.id,
              topic: selectedTopic.topic,
              description: selectedTopic.description,
              tutor_services: [newService],
            };
            const updatedTopics = [...currentUser.topics, newTopicEntry];
            setCurrentUser({ ...currentUser, topics: updatedTopics });
          }
          formik.resetForm();
          onClose();
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    },
  });

  const handleCreateTopic = () => {
    if (!topicName) {
      setError("Topic name is required");
      return;
    }

    setError("");
    setCreatingTopic(true);

    fetch("/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        topic: topicName,
        description: topicDescription,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create topic");
        return res.json();
      })
      .then((newTopic) => {
        setTopics([...topics, newTopic]);
        setTopicName("");
        setTopicDescription("");
        setShowCreateTopic(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCreatingTopic(false));
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Service</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label" htmlFor="topicId">Topic</label>
                <select
                  id="topicId"
                  name="topicId"
                  className="form-select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.topicId}
                  disabled={isLoading || creatingTopic}
                >
                  <option value="">-- Select a topic --</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.topic}
                    </option>
                  ))}
                </select>
                {formik.touched.topicId && formik.errors.topicId && (
                  <p className="text-danger small">{formik.errors.topicId}</p>
                )}
              </div>

              <hr className="my-3" />

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100 mb-3"
                onClick={() => setShowCreateTopic(!showCreateTopic)}
                disabled={creatingTopic}
              >
                {showCreateTopic ? "▼ Hide Create Topic" : "▶ Create New Topic"}
              </button>

              {showCreateTopic && (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="newTopicName">Topic Name</label>
                    <input
                      id="newTopicName"
                      type="text"
                      className="form-control"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      disabled={creatingTopic}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="newTopicDescription">Topic Description</label>
                    <textarea
                      id="newTopicDescription"
                      className="form-control"
                      rows="2"
                      value={topicDescription}
                      onChange={(e) => setTopicDescription(e.target.value)}
                      disabled={creatingTopic}
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm mb-3"
                    onClick={handleCreateTopic}
                    disabled={creatingTopic}
                  >
                    {creatingTopic ? "Creating..." : "Create Topic"}
                  </button>

                  <hr className="my-3" />
                </>
              )}

              <div className="mb-3">
                <label className="form-label" htmlFor="rate">Rate ($/hour)</label>
                <input
                  id="rate"
                  name="rate"
                  type="number"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.rate}
                  disabled={isLoading || creatingTopic}
                />
                {formik.touched.rate && formik.errors.rate && (
                  <p className="text-danger small">{formik.errors.rate}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  disabled={isLoading || creatingTopic}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading || creatingTopic}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading || creatingTopic}>
                {isLoading ? "Creating..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddServiceModal;
