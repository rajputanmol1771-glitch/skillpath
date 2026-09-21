import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./Header.css";

const Header = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/courses">Our Courses</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>

          {!user && <li><NavLink to="/login">Login</NavLink></li>}
          {!user && <li><NavLink to="/register">Register</NavLink></li>}

          {role === "admin" && (
            <li><NavLink to="/admin">Admin Panel</NavLink></li>
          )}

          {role === "student" && (
            <li><NavLink to="/student/dashboard">My Dashboard</NavLink></li>
          )}

          {user && <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
