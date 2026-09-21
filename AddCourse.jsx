import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CourseServices from "../../../services/CourseServices";
import CloudinaryServices from "../../../services/CloudinaryServices";
import "./AddCourse.css";

const emptyForm = {
  title: "",
  description: "",
  aboutText: "",
  image: "",
  subject: "",
  difficulty: "Beginner",
  duration: "",
  objectives: [""],
  topics: [{ id: crypto.randomUUID(), name: "" }],
  status: true,
};

function AddCourse() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const course = await CourseServices.Get(id);
      if (!course) {
        toast.error("Course not found");
        navigate("/admin/courses");
        return;
      }
      setForm({
        ...emptyForm,
        ...course,
        objectives: course.objectives?.length ? course.objectives : [""],
        topics: course.topics?.length ? course.topics : emptyForm.topics,
      });
      setLoading(false);
    })();
  }, [id, isEdit, navigate]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateObjective = (i, value) => {
    const next = [...form.objectives];
    next[i] = value;
    update("objectives", next);
  };
  const addObjective = () => update("objectives", [...form.objectives, ""]);
  const removeObjective = (i) => update("objectives", form.objectives.filter((_, idx) => idx !== i));

  const updateTopic = (i, value) => {
    const next = [...form.topics];
    next[i] = { ...next[i], name: value };
    update("topics", next);
  };
  const addTopic = () => update("topics", [...form.topics, { id: crypto.randomUUID(), name: "" }]);
  const removeTopic = (i) => {
    if (form.topics.length === 1) {
      toast.error("A course needs at least one topic");
      return;
    }
    update("topics", form.topics.filter((_, idx) => idx !== i));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await CloudinaryServices.uploadImage(file);
    setUploading(false);
    if (url) {
      update("image", url);
      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed — you can also paste an image URL");
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.description.trim()) return "Course description is required";
    if (form.topics.some((t) => !t.name.trim())) return "Every topic needs a name (or remove empty ones)";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      ...form,
      objectives: form.objectives.map((o) => o.trim()).filter(Boolean),
      topics: form.topics.map((t, i) => ({ ...t, name: t.name.trim(), order: i })),
    };
    delete payload.id;

    setSaving(true);
    let ok;
    if (isEdit) {
      ok = await CourseServices.Update(id, payload);
    } else {
      ok = await CourseServices.Add(payload);
    }
    setSaving(false);

    if (ok) {
      toast.success(isEdit ? "Course updated" : "Course created");
      navigate("/admin/courses");
    } else {
      toast.error("Something went wrong, please try again");
    }
  };

  if (loading) return <p>Loading course…</p>;

  return (
    <div className="add-course-page">
      <h3 className="fw-bold mb-4">{isEdit ? "Edit Course" : "Add Course"}</h3>

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Course Title</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. JavaScript Complete Course"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Subject / Category</label>
              <input
                className="form-control"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Duration</label>
              <input
                className="form-control"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="e.g. 6 hours"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status ? "active" : "draft"}
                onChange={(e) => update("status", e.target.value === "active")}
              >
                <option value="active">Active (visible to students)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="One or two lines shown on the course cards"
              />
            </div>

            <div className="col-12">
              <label className="form-label">About This Course</label>
              <textarea
                className="form-control"
                rows={4}
                value={form.aboutText}
                onChange={(e) => update("aboutText", e.target.value)}
                placeholder="Full description shown on the course details page — who it's for, what it covers, etc."
              />
            </div>

            <div className="col-12">
              <label className="form-label">Course Image</label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <input
                  className="form-control"
                  style={{ maxWidth: 420 }}
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="Image URL (or upload below)"
                />
                <label className="btn btn-outline-secondary mb-0">
                  <i className="bi bi-upload me-1" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </label>
                {form.image && <img src={form.image} alt="preview" style={{ height: 48, borderRadius: 8 }} />}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>What You'll Learn (objectives)</span>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addObjective}>
                  + Add
                </button>
              </label>
              {form.objectives.map((o, i) => (
                <div className="d-flex gap-2 mb-2" key={i}>
                  <input
                    className="form-control"
                    value={o}
                    onChange={(e) => updateObjective(i, e.target.value)}
                    placeholder={`Objective ${i + 1}`}
                  />
                  <button type="button" className="btn btn-outline-danger" onClick={() => removeObjective(i)}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}
            </div>

            <div className="col-12">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>Topics</span>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addTopic}>
                  + Add Topic
                </button>
              </label>
              <p className="text-muted small">
                Add quizzes to each topic afterwards from the <b>Add Quiz</b> page.
              </p>
              {form.topics.map((t, i) => (
                <div className="d-flex gap-2 mb-2 align-items-center" key={t.id}>
                  <span className="text-muted" style={{ width: 24 }}>{i + 1}.</span>
                  <input
                    className="form-control"
                    value={t.name}
                    onChange={(e) => updateTopic(i, e.target.value)}
                    placeholder={`Topic ${i + 1} name`}
                  />
                  <button type="button" className="btn btn-outline-danger" onClick={() => removeTopic(i)}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/courses")}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default AddCourse;
