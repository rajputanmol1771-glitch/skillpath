import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import EnrollmentServices from "../../services/EnrollmentServices";
import { toast } from "react-toastify";

function CourseCard({ course }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [joinState, setJoinState] = useState("idle"); // idle | joining | joined
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (user && role === "student") {
        const existing = await EnrollmentServices.Get(user.uid, course.id);
        if (active && existing) setJoinState("joined");
      }
      if (active) setChecking(false);
    })();
    return () => { active = false; };
  }, [user, role, course.id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    if (role === "admin") {
      toast.error("Admin accounts cannot join courses.");
      return;
    }
    if (joinState === "joined") {
      navigate(`/courses/${course.id}`);
      return;
    }

    setJoinState("joining");
    const res = await EnrollmentServices.Join(user.uid, course);
    if (res) {
      setJoinState("joined");
      toast.success("Joined course!");
    } else {
      setJoinState("idle");
      toast.error("Could not join course, try again");
    }
  };

  const buttonLabel = checking
    ? "..."
    : joinState === "joining"
    ? "Joining..."
    : joinState === "joined"
    ? "Continue Course"
    : "Join Course";

  return (
    <div className="col-lg-4 col-md-6">
      <div className="course-item bg-light h-100">
        <div className="position-relative overflow-hidden">
          <img
            className="img-fluid"
            src={course.image || "/images/about.svg"}
            alt={course.title}
            style={{ height: 190, width: "100%", objectFit: "cover" }}
          />
          <span className="lg-course-badge">{course.subject || "General"}</span>
        </div>
        <div className="p-4 pb-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-primary fw-semibold">{course.difficulty || "Beginner"}</small>
            <small className="text-muted">{course.duration}</small>
          </div>
          <h5 className="mb-2">
            <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
              {course.title}
            </Link>
          </h5>
          <p className="text-muted small mb-3" style={{ minHeight: 40 }}>
            {(course.description || "").slice(0, 90)}
            {course.description && course.description.length > 90 ? "…" : ""}
          </p>
        </div>
        <div className="d-flex border-top">
          <Link to={`/courses/${course.id}`} className="flex-fill text-center py-2 border-end text-decoration-none">
            <i className="fa fa-info-circle text-primary me-2" />
            Details
          </Link>
          <button
            onClick={handleJoin}
            disabled={joinState === "joining"}
            className="flex-fill text-center py-2 border-0 bg-transparent lg-join-btn"
          >
            <i className={`fa ${joinState === "joined" ? "fa-arrow-right" : "fa-user-plus"} text-primary me-2`} />
            {buttonLabel}
          </button>
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
export default CourseCard;
