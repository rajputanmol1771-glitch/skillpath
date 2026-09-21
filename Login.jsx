import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import "./login.css";

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <section className="login-section">
      <div className="login">
        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Log in to continue to Skillpath</p>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control email-field"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle-icon`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            SUBMIT
          </button>
        </form>
        <p className="login-footer-text">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </section>
  )
}

export default Login;
