import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import "./login.css";

function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      // AuthContext automatically creates the Firestore user doc
      // (role: admin/student) the moment this new login is detected.
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already registered");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <section className="login-section">
      <div className="login">
        <div className="login-heading">
          <h2>Create Account</h2>
          <p>Join Skillpath and start learning</p>
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="form-control email-field"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="form-control email-field"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper" style={{ marginBottom: 18 }}>
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

          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="login-footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </section>
  )
}

export default Register;
