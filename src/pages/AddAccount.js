import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddAccount() {
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [loginError, setLoginError] = useState(null); // Hata

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };

  const generateAccountNumber = () => {
    const firstPart = Math.floor(Math.random() * 900) + 100; // Generate a 3-digit number
    const secondPart = Math.floor(Math.random() * 9000000) + 1000000; // Generate a 7-digit number
    return firstPart + "-" + secondPart;
  };

  const createNewAccount = async (e) => {
    e.preventDefault();

    try {
      if (!accountName.trim()) {
        setLoginError("Account name is empty");
        return;
      }
      if (!accountBalance.trim()) {
        setLoginError("Account balance is empty");
        return;
      }

      await axios.post(
        "http://localhost:8080/api/accounts/create",
        {
          name: accountName,
          number: generateAccountNumber(),
          balance: accountBalance,
          userId: user.id,
        },
        config
      );

      navigate("/accounts");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  return (
    <div className="page-container">
      <div className="welcome">Create new account</div>
      <form onSubmit={createNewAccount}>
        <div className="input-container">
          <input
            type="text"
            value={accountName}
            placeholder="account name"
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="number"
            value={accountBalance}
            placeholder="account balance"
            onChange={(e) => setAccountBalance(e.target.value)}
          />
        </div>
        {loginError && <div className="error">{loginError}</div>}
        <button type="submit" className="form-button">
          create
        </button>
      </form>
    </div>
  );
}
