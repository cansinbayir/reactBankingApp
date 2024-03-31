import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [registerError, setRegisterError] = useState(null);

  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userName.trim() || !userEmail.trim() || !password.trim()) {
        setRegisterError("Fields cannot be empty");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          username: userName,
          email: userEmail,
          password: password,
        }
      );

      localStorage.setItem("jwtToken", response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      setUser({ id: decodedToken.uuid, userName: decodedToken.sub });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("An error occurred during registration");
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
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Email"
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
        {registerError && <div className="error">{registerError}</div>}
        <button type="submit">Register</button>
      </form>
      <div>
        <span>Already have an account?</span>
        <Link to="/">Login</Link>
      </div>
    </div>
  );
}
