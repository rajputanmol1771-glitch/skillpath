import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import CourseServices from "../services/CourseServices";
import QuizServices from "../services/QuizServices";
import EnrollmentServices from "../services/EnrollmentServices";
import CertificateServices from "../services/CertificateServices";
import ProgressBar from "./shared/ProgressBar";
import "./CourseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const c = await CourseServices.Get(id);
      const qs = await QuizServices.ByCourse(id);
      setCourse(c);
      setQuizzes(qs.filter((q) => q.status));
      if (user && role === "student") {
        const e = await EnrollmentServices.Get(user.uid, id);
        setEnrollment(e);
      }
      setLoading(false);
    })();
  }, [id, user, role]);

  const handleJoin = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    if (role === "admin") {
      toast.error("Admin accounts cannot join courses.");
      return;
    }
    setJoining(true);
    const res = await EnrollmentServices.Join(user.uid, course);
    setJoining(false);
    if (res) {
      setEnrollment(res);
      toast.success("Joined course!");
    } else {
      toast.error("Could not join course, try again");
    }
  };

  if (loading) return <div className="container py-5">Loading course…</div>;
  if (!course) return <div className="container py-5">Course not found.</div>;

  const quizzesByTopic = {};
  quizzes.forEach((q) => {
    quizzesByTopic[q.topicId] = quizzesByTopic[q.topicId] || [];
    quizzesByTopic[q.topicId].push(q);
  });

  const completedQuizIds = new Set(enrollment?.completedQuizIds || []);

  const topicIsDone = (topic) => {
    const topicQuizzes = quizzesByTopic[topic.id] || [];
    return topicQuizzes.length > 0 && topicQuizzes.every((q) => completedQuizIds.has(q.id));
  };
  const currentTopicIndex = enrollment
    ? (course.topics || []).findIndex((t) => !topicIsDone(t))
    : -1;

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-8">
            <span className="lg-course-subject">{course.subject || "General"}</span>
            <h1 className="mb-3">{course.title}</h1>
            <p className="text-muted mb-4">{course.description}</p>

            <div className="course-about-card mb-4">
              <h5 className="mb-3">About This Course</h5>
              <p style={{ whiteSpace: "pre-line" }}>{course.aboutText || course.description}</p>

              {course.objectives?.length > 0 && (
                <>
                  <h6 className="mt-4 mb-2">What you will learn</h6>
                  <ul className="course-objectives">
                    {course.objectives.map((o, i) => (
                      <li key={i}><i className="fa fa-check-circle text-primary me-2" />{o}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="row text-center mt-4 g-3">
                <div className="col-6 col-md-3">
                  <div className="course-meta-box">
                    <i className="fa fa-signal" />
                    <div>{course.difficulty}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="course-meta-box">
                    <i className="fa fa-clock" />
                    <div>{course.duration || "—"}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="course-meta-box">
                    <i className="fa fa-layer-group" />
                    <div>{(course.topics || []).length} topics</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="course-meta-box">
                    <i className="fa fa-tasks" />
                    <div>{quizzes.length} quizzes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-about-card">
              <h5 className="mb-3">Course Structure</h5>
              {(course.topics || []).map((topic, i) => {
                const topicQuizzes = quizzesByTopic[topic.id] || [];
                const allDone = topicIsDone(topic);
                let statusIcon = "○";
                let statusClass = "locked";
                if (allDone) {
                  statusIcon = "✓";
                  statusClass = "done";
                } else if (i === currentTopicIndex) {
                  statusIcon = "→";
                  statusClass = "current";
                }
                return (
                  <div className="topic-row" key={topic.id}>
                    <div className="d-flex align-items-center gap-3">
                      <span className={`topic-status ${statusClass}`}>{statusIcon}</span>
                      <div>
                        <div className="fw-semibold">{i + 1}. {topic.name}</div>
                        <small className="text-muted">
                          {topicQuizzes.length} quiz{topicQuizzes.length !== 1 ? "zes" : ""}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      {topicQuizzes.map((q) => {
                        const done = completedQuizIds.has(q.id);
                        const score = enrollment?.scores?.[q.id];
                        return enrollment ? (
                          <button
                            key={q.id}
                            className={`btn btn-sm ${done ? "btn-outline-success" : "btn-primary"}`}
                            onClick={() => navigate(`/student/course/${course.id}/quiz/${q.id}`)}
                          >
                            {done ? `✓ ${score?.percent ?? ""}%` : `Take: ${q.title}`}
                          </button>
                        ) : (
                          <span key={q.id} className="text-muted small">{q.title}</span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="course-sidebar">
              <img
                src={course.image || "/images/about.svg"}
                alt={course.title}
                className="img-fluid rounded-3 mb-3"
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />

              {enrollment && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Your progress</span>
                    <span>{enrollment.progress || 0}%</span>
                  </div>
                  <ProgressBar percent={enrollment.progress || 0} />
                  {enrollment.latestScore != null && (
                    <small className="text-muted d-block mt-2">Latest score: {enrollment.latestScore}%</small>
                  )}
                </div>
              )}

              {role !== "admin" && (
                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={handleJoin}
                  disabled={joining || Boolean(enrollment)}
                >
                  {joining ? "Joining..." : enrollment ? "Joined ✓" : "Join Course"}
                </button>
              )}
              {enrollment?.completed && (
                <button
                  className="btn btn-success w-100 py-2 mt-2"
                  onClick={() => {
                    const scores = Object.values(enrollment.scores || {});
                    const avg = scores.length
                      ? Math.round(scores.reduce((s, r) => s + (r.percent || 0), 0) / scores.length)
                      : enrollment.latestScore;
                    CertificateServices.download({
                      studentName: user?.displayName || user?.email,
                      courseName: course.title,
                      percent: avg,
                      completedAt: enrollment.enrolledAt,
                    });
                  }}
                >
                  <i className="fa fa-award me-2" />
                  Download Certificate
                </button>
              )}
              {role === "admin" && (
                <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-outline-primary w-100 py-2">
                  Edit Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLoginPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(15, 23, 42, 0.55)", zIndex: 1050 }}
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            className="bg-white rounded-4 p-4 text-center shadow-lg"
            style={{ maxWidth: 360, width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fa fa-lock text-primary mb-3" style={{ fontSize: "2rem" }} />
            <h5 className="mb-2">Login Required</h5>
            <p className="text-muted mb-4">Please login to join this course.</p>
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/login" className="btn btn-primary px-4">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary px-4">Register</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CourseDetails;
