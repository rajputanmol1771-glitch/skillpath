import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CourseServices from "../../../services/CourseServices";
import QuizServices from "../../../services/QuizServices";
import "../../shared/shared.css";

function ManageQuizzes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const courseFilter = searchParams.get("courseId") || "";

  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const allCourses = await CourseServices.All();
    setCourses(allCourses);
    const allQuizzes = courseFilter
      ? await QuizServices.ByCourse(courseFilter)
      : await QuizServices.All();
    setQuizzes(allQuizzes);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [courseFilter]);

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
    const res = await QuizServices.Delete(quiz.id);
    if (res) {
      toast.success("Quiz deleted");
      fetchData();
    } else {
      toast.error("Could not delete quiz");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="fw-bold mb-0">Quizzes</h3>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={courseFilter}
            onChange={(e) => setSearchParams(e.target.value ? { courseId: e.target.value } : {})}
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <Link
            to={courseFilter ? `/admin/quizzes/new?courseId=${courseFilter}` : "/admin/quizzes/new"}
            className="btn btn-primary text-nowrap"
          >
            <i className="bi bi-plus-lg" /> Add Quiz
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Quiz</th>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q, i) => (
                  <tr key={q.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-semibold">{q.title}</td>
                    <td>{q.courseName}</td>
                    <td>{q.topicName}</td>
                    <td>{(q.questions || []).length}</td>
                    <td>
                      <span className={`lg-badge ${q.status ? "active" : "draft"}`}>
                        {q.status ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/admin/quizzes/${q.id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                          <i className="bi bi-pencil" />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(q)} title="Delete">
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {quizzes.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7">
                      <div className="lg-empty">
                        <i className="fa fa-tasks" />
                        No quizzes found. <Link to="/admin/quizzes/new">Add one</Link>.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageQuizzes;
