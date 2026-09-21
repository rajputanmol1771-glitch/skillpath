import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import EnrollmentServices from "../../services/EnrollmentServices";
import CourseServices from "../../services/CourseServices";
import CertificateServices from "../../services/CertificateServices";
import ProgressBar from "../shared/ProgressBar";
import "../shared/shared.css";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await EnrollmentServices.ForUser(user.uid);
      setEnrollments(list);
      const courseMap = {};
      await Promise.all(
        list.map(async (e) => {
          const c = await CourseServices.Get(e.courseId);
          if (c) courseMap[e.courseId] = c;
        })
      );
      setCourses(courseMap);
      setLoading(false);
    })();
  }, [user]);

  const completedCourses = enrollments.filter((e) => e.completed).length;
  const totalQuizzesCompleted = enrollments.reduce((sum, e) => sum + (e.completedQuizIds?.length || 0), 0);
  const scoresFlat = enrollments.flatMap((e) => Object.values(e.scores || {}));
  const avgScore = scoresFlat.length
    ? Math.round(scoresFlat.reduce((sum, s) => sum + (s.percent || 0), 0) / scoresFlat.length)
    : 0;
  const certificates = completedCourses;

  const cards = [
    { label: "Enrolled Courses", value: enrollments.length, icon: "fa-book", color: "#0b5cfe" },
    { label: "Completed Courses", value: completedCourses, icon: "fa-flag-checkered", color: "#059669" },
    { label: "Quizzes Completed", value: totalQuizzesCompleted, icon: "fa-tasks", color: "#7c3aed" },
    { label: "Average Score", value: `${avgScore}%`, icon: "fa-chart-line", color: "#d97706" },
    { label: "Certificates Earned", value: certificates, icon: "fa-award", color: "#dc2626" },
  ];

  return (
    <div className="container-xxl py-5 student-dashboard">
      <div className="container">
        <h2 className="mb-1">Welcome back, {user?.displayName || "Student"}!</h2>
        <p className="text-muted mb-4">Here's how your learning is going.</p>

        <div className="row g-3 mb-5">
          {cards.map((c) => (
            <div className="col-6 col-lg" key={c.label}>
              <div className="lg-stat-card flex-column align-items-start text-start">
                <div className="icon mb-2" style={{ background: c.color }}>
                  <i className={`fa ${c.icon}`} />
                </div>
                <div className="value">{loading ? "…" : c.value}</div>
                <div className="label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">My Courses</h4>
          <Link to="/courses" className="btn btn-sm btn-outline-primary">Browse more courses</Link>
        </div>

        {enrollments.length === 0 && !loading && (
          <div className="lg-empty">
            <i className="fa fa-book" />
            You haven't joined any courses yet. <Link to="/courses">Browse courses</Link>.
          </div>
        )}

        <div className="row g-4">
          {enrollments.map((e) => {
            const course = courses[e.courseId];
            return (
              <div className="col-lg-4 col-md-6" key={e.id}>
                <div className="my-course-card">
                  <img
                    src={course?.image || "/images/about.svg"}
                    alt={e.courseName}
                    className="my-course-image"
                  />
                  <div className="p-3">
                    <h5 className="mb-1">{e.courseName}</h5>
                    <p className="text-muted small mb-3">
                      {course?.description?.slice(0, 80) || "Continue where you left off."}
                    </p>

                    <div className="d-flex justify-content-between small mb-1">
                      <span>Progress</span>
                      <span>{e.progress || 0}%</span>
                    </div>
                    <ProgressBar percent={e.progress || 0} />

                    <div className="d-flex justify-content-between small text-muted mt-3 mb-3">
                      <span>{e.completedQuizIds?.length || 0} / {(course?.topics || []).length || "?"} quizzes</span>
                      <span>Latest: {e.latestScore != null ? `${e.latestScore}%` : "—"}</span>
                    </div>

                    <Link to={`/courses/${e.courseId}`} className="btn btn-primary w-100">
                      Continue Course
                    </Link>

                    {e.completed && (
                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => {
                          const scores = Object.values(e.scores || {});
                          const avg = scores.length
                            ? Math.round(scores.reduce((s, r) => s + (r.percent || 0), 0) / scores.length)
                            : e.latestScore;
                          CertificateServices.download({
                            studentName: user?.displayName || user?.email,
                            courseName: e.courseName,
                            percent: avg,
                            completedAt: e.enrolledAt,
                          });
                        }}
                      >
                        <i className="fa fa-award me-2" />
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default StudentDashboard;
