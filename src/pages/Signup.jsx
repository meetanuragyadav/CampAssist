import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";
import Navbar from "../components/Navbar";
import "./Login.css";
import signupIllustration from "../assets/Login-page.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const checkStrength = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pass)) return "Password must contain 1 uppercase letter";
    if (!/[0-9]/.test(pass)) return "Password must contain 1 number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (password !== confirm) throw new Error("Passwords do not match");

      const weak = checkStrength(password);
      if (weak) throw new Error(weak);

      const res = await registerUser(name, email, password);
      setMsgType("success");
      setMessage(res.data.message);

      // Auto login after register
      const loginRes = await loginUser(email, password);
      localStorage.setItem("userName", loginRes.data.name);
      localStorage.setItem("userEmail", loginRes.data.email);

      setTimeout(() => navigate("/buyer"), 1200);
    } catch (err) {
      setMsgType("error");
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

<div className="login-page register-page">
        <div
          className="login-bg"
          style={{ backgroundImage: `url(${signupIllustration})` }}
        >
          <div className="login-overlay">
            <h2>Create Account</h2>

            <p className="subtitle">
              Join the CampusAssist community
            </p>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="College Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              {message && (
                <div className={`message ${msgType}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="switch">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
