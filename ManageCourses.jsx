import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CourseServices from "../../../services/CourseServices";
import QuizServices from "../../../services/QuizServices";
import "../../shared/shared.css";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [quizCounts, setQuizCounts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await CourseServices.All();
    setCourses(data);
    const allQuizzes = await QuizServices.All();
    const counts = {};
    allQuizzes.forEach((q) => {
      counts[q.courseId] = (counts[q.courseId] || 0) + 1;
    });
    setQuizCounts(counts);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    const res = await CourseServices.Delete(course.id);
    if (res) {
      toast.success("Course deleted");
      fetchData();
    } else {
      toast.error("Could not delete course");
    }
  };

  const toggleStatus = async (course) => {
    const res = await CourseServices.Update(course.id, { status: !course.status });
    if (res) fetchData();
  };

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="fw-bold mb-0">Courses</h3>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/admin/courses/new" className="btn btn-primary text-nowrap">
            <i className="bi bi-plus-lg" /> Add Course
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
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Topics</th>
                  <th>Quizzes</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-semibold">{c.title}</td>
                    <td>{c.subject}</td>
                    <td>{(c.topics || []).length}</td>
                    <td>{quizCounts[c.id] || 0}</td>
                    <td>
                      <button
                        className={`lg-badge ${c.status ? "active" : "draft"} border-0`}
                        onClick={() => toggleStatus(c)}
                        title="Click to toggle"
                      >
                        {c.status ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/courses/${c.id}`} className="btn btn-sm btn-outline-secondary" title="View">
                          <i className="bi bi-eye" />
                        </Link>
                        <Link to={`/admin/courses/${c.id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                          <i className="bi bi-pencil" />
                        </Link>
                        <Link to={`/admin/quizzes?courseId=${c.id}`} className="btn btn-sm btn-outline-info" title="Quizzes">
                          <i className="bi bi-list-check" />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)} title="Delete">
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7">
                      <div className="lg-empty">
                        <i className="fa fa-book" />
                        No courses found. <Link to="/admin/courses/new">Add one</Link>.
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
export default ManageCourses;
