import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import CourseServices from "../../../services/CourseServices";
import QuizServices from "../../../services/QuizServices";
import "../../shared/shared.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, quizzes: 0, students: 0, enrollments: 0 });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [courses, quizzes, usersSnap, enrollSnap] = await Promise.all([
        CourseServices.All(),
        QuizServices.All(),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "enrollments")),
      ]);
      const students = usersSnap.docs.filter((d) => d.data().role === "student").length;
      setStats({
        courses: courses.length,
        quizzes: quizzes.length,
        students,
        enrollments: enrollSnap.docs.length,
      });
      setRecentCourses(courses.slice(-5).reverse());
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Total Courses", value: stats.courses, icon: "fa-book", color: "#0b5cfe" },
    { label: "Total Quizzes", value: stats.quizzes, icon: "fa-tasks", color: "#7c3aed" },
    { label: "Total Students", value: stats.students, icon: "fa-user-graduate", color: "#059669" },
    { label: "Total Enrollments", value: stats.enrollments, icon: "fa-user-plus", color: "#d97706" },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-4">Admin Dashboard</h3>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-sm-6 col-lg-3" key={c.label}>
            <div className="lg-stat-card">
              <div className="icon" style={{ background: c.color }}>
                <i className={`fa ${c.icon}`} />
              </div>
              <div>
                <div className="value">{loading ? "…" : c.value}</div>
                <div className="label">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Recent Courses</h5>
            <Link to="/admin/courses" className="btn btn-sm btn-outline-primary">View all</Link>
          </div>
          {recentCourses.length === 0 && !loading && (
            <div className="lg-empty">
              <i className="fa fa-book" />
              No courses yet. <Link to="/admin/courses/new">Create your first course</Link>.
            </div>
          )}
          <div className="table-responsive">
            {recentCourses.length > 0 && (
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Topics</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-semibold">{c.title}</td>
                      <td>{c.subject}</td>
                      <td>{(c.topics || []).length}</td>
                      <td>
                        <span className={`lg-badge ${c.status ? "active" : "draft"}`}>
                          {c.status ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link to={`/admin/courses/${c.id}/edit`} className="btn btn-sm btn-outline-secondary">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
