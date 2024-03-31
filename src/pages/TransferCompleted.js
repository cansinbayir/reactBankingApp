import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function TransferCompleted() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  console.log(user);

  return (
    <div className="page-container">
      <div className="welcome">{user.lastTransactionResult}</div>
      <button className="btn" onClick={() => navigate("/accounts")}>
        Back to Accounts
      </button>
    </div>
  );
}
