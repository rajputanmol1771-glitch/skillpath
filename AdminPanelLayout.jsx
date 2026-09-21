import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./AdminPanelLayout.css";

const NAV = [
  { to: "/admin", end: true, icon: "fa-tachometer-alt", label: "Dashboard" },
  { to: "/admin/courses", icon: "fa-book", label: "Courses" },
  { to: "/admin/courses/new", icon: "fa-plus", label: "Add Course" },
  { to: "/admin/quizzes", icon: "fa-tasks", label: "Quizzes" },
  { to: "/admin/quizzes/new", icon: "fa-plus-square", label: "Add Quiz" },
  { to: "/admin/students", icon: "fa-user-graduate", label: "Students" },
  { to: "/admin/results", icon: "fa-chart-bar", label: "Results" },
];

function AdminPanelLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <i className="fa fa-graduation-cap" /> LearningGaints
        </div>
        <nav>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
            >
              <i className={`fa ${item.icon}`} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link">
            <i className="fa fa-arrow-left" /> View Site
          </NavLink>
          <button className="admin-nav-link admin-logout" onClick={handleLogout}>
            <i className="fa fa-sign-out-alt" /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-user">
            <i className="fa fa-user-circle" />
            {user?.displayName || user?.email}
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default AdminPanelLayout;
