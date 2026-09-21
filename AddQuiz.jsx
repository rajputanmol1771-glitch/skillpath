import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CourseServices from "../../../services/CourseServices";
import QuizServices from "../../../services/QuizServices";
import "./AddCourse.css";

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 });

function AddQuiz() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [topicId, setTopicId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingMarks, setPassingMarks] = useState(0);
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState(true);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await CourseServices.All();
      setCourses(all);

      if (isEdit) {
        const quiz = await QuizServices.Get(id);
        if (!quiz) {
          toast.error("Quiz not found");
          navigate("/admin/quizzes");
          return;
        }
        setCourseId(quiz.courseId);
        setTopicId(quiz.topicId);
        setTitle(quiz.title);
        setDescription(quiz.description || "");
        setPassingMarks(quiz.passingMarks || 0);
        setOrder(quiz.order || 0);
        setStatus(quiz.status ?? true);
        setQuestions(quiz.questions?.length ? quiz.questions : [emptyQuestion()]);
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const selectedCourse = courses.find((c) => c.id === courseId);
  const topics = selectedCourse?.topics || [];

  const updateQuestion = (qi, field, value) => {
    const next = [...questions];
    next[qi] = { ...next[qi], [field]: value };
    setQuestions(next);
  };
  const updateOption = (qi, oi, value) => {
    const next = [...questions];
    const opts = [...next[qi].options];
    opts[oi] = value;
    next[qi] = { ...next[qi], options: opts };
    setQuestions(next);
  };
  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = (qi) => {
    if (questions.length === 1) {
      toast.error("A quiz needs at least one question");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== qi));
  };

  const validate = () => {
    if (!courseId) return "Select a course";
    if (!topicId) return "Select a topic";
    if (!title.trim()) return "Quiz title is required";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} is empty`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const topic = topics.find((t) => t.id === topicId);

    const payload = {
      courseId,
      courseName: selectedCourse?.title || "",
      topicId,
      topicName: topic?.name || "",
      title: title.trim(),
      description: description.trim(),
      questions,
      passingMarks: Math.min(100, Math.max(0, Number(passingMarks) || 0)),
      order: Number(order) || 0,
      status,
    };

    setSaving(true);
    const ok = isEdit ? await QuizServices.Update(id, payload) : await QuizServices.Add(payload);
    setSaving(false);

    if (ok) {
      toast.success(isEdit ? "Quiz updated" : "Quiz created");
      navigate(`/admin/quizzes?courseId=${courseId}`);
    } else {
      toast.error("Something went wrong, please try again");
    }
  };

  if (loading) return <p>Loading quiz…</p>;

  return (
    <div className="add-course-page">
      <h3 className="fw-bold mb-4">{isEdit ? "Edit Quiz" : "Add Quiz"}</h3>

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label className="form-label">Course</label>
              <select
                className="form-select"
                value={courseId}
                onChange={(e) => { setCourseId(e.target.value); setTopicId(""); }}
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Topic</label>
              <select
                className="form-select"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                disabled={!courseId}
              >
                <option value="">Select a topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {courseId && topics.length === 0 && (
                <small className="text-danger">This course has no topics yet — add one from Edit Course.</small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Quiz Title</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Passing Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-control"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
                placeholder="e.g. 50"
              />
              <small className="text-muted">
                % of correct answers needed to pass — not a raw mark count. 50 = student needs 50% correct, regardless of question count.
              </small>
            </div>
            <div className="col-md-3">
              <label className="form-label">Order</label>
              <input type="number" className="form-control" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={status ? "active" : "draft"} onChange={(e) => setStatus(e.target.value === "active")}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Questions</h5>
            <button type="button" className="btn btn-sm btn-primary" onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          {questions.map((q, qi) => (
            <div className="quiz-question-card mb-3" key={qi}>
              <div className="quiz-question-top d-flex justify-content-between align-items-center mb-2">
                <span className="quiz-question-number fw-bold">Q{qi + 1}</span>
                <div className="d-flex align-items-center gap-2">
                  <label className="small text-muted mb-0">Marks</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: 70 }}
                    value={q.marks}
                    onChange={(e) => updateQuestion(qi, "marks", Number(e.target.value))}
                  />
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(qi)}>
                    Remove
                  </button>
                </div>
              </div>
              <input
                className="form-control mb-2"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => updateQuestion(qi, "question", e.target.value)}
              />
              {q.options.map((opt, oi) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={oi}>
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctAnswer === oi}
                    onChange={() => updateQuestion(qi, "correctAnswer", oi)}
                    title="Mark as correct answer"
                  />
                  <input
                    className="form-control"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                  />
                </div>
              ))}
              <p className="text-muted small mb-0">Select the radio button next to the correct option.</p>
            </div>
          ))}

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Quiz"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/quizzes")}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default AddQuiz;
