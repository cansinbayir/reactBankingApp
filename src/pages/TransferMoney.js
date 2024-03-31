import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function TransferMoney() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [transferError, setTransferError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/accounts/get-accounts?userId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      setTransferError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/transactions/transfer",
        {
          sourceAccount: fromAccount,
          targetAccount: toAccount,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      //log the transfer status on transfer-completed page.
      setUser((user) => ({
        ...user,
        lastTransactionResult:
          response.data.status === "SUCCESS"
            ? "Transfer completed successfully"
            : "Transfer failed. Not enough balance",
      }));

      navigate("/transfer-completed");
    } catch (error) {
      console.error("Error transferring money:", error);
      setTransferError("Transfer failed. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div className="welcome">Transfer Money</div>
      <form onSubmit={handleTransfer}>
        <div className="input-container">
          <label htmlFor="fromAccount">From:</label>
          <select
            id="fromAccount"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} - {account.number}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="toAccount">To:</label>
          <select
            id="toAccount"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {accounts
              .filter((account) => account.id !== fromAccount)
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.number}
                </option>
              ))}
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {transferError && <div className="error">{transferError}</div>}
        <button type="submit" className="form-button">
          Transfer
        </button>
      </form>
    </div>
  );
}
