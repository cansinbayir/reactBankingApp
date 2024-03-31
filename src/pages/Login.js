import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !password.trim()) {
      setLoginError("Username or password cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          username: userName,
          password: password,
        }
      );
      localStorage.setItem("jwtToken", response.data.token);
      const decodedToken = jwtDecode(response.data.token);

      setUser({ id: decodedToken.uuid, userName: decodedToken.sub });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">Welcome</div>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        {loginError && <div className="error">{loginError}</div>}
        <button type="submit">Login</button>
        <div>
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
