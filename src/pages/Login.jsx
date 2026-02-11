import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Navbar from "../components/Navbar";
import "./Login.css";
import loginIllustration from "../assets/Login-page.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await loginUser(email, password);
      setMsgType("success");
      setMessage(res.data.message);

      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);

      setTimeout(() => navigate("/buyer"), 1200);
    } catch (err) {
      setMsgType("error");
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  <Navbar />

  <div
    className="login-bg login-page-only"
style={{ backgroundImage: `url(${loginIllustration})` }}
  >
    <div className="login-overlay">
      <h2>Welcome To Family</h2>

      <p className="subtitle">
        A community of hundreds of members<br />
        to share arts and ideas
      </p>

      <form onSubmit={handleLogin}>
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

        {message && (
          <div className={`message ${msgType}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>

      <p className="switch">
        New here?{" "}
        <span onClick={() => navigate("/register")}>
          Create an account
        </span>
      </p>
    </div>
  </div>
</>
  );
}
