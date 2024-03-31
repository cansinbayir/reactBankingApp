import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="page-container">
      <div className="welcome">Welcome to Dashboard, {user.userName}!</div>
      <div className="links-container">
        <Link to="/accounts" className="navigate-link">
          My Accounts
        </Link>
        <Link to="/transfer" className="navigate-link">
          Transfer Money
        </Link>
        <Link to="/add-account" className="navigate-link">
          Create Account
        </Link>
      </div>
    </div>
  );
}
