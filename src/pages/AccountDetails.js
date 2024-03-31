import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AccountDetails() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/accounts/get-account-details/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setAccountDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [accountId]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setTransactions(response.data);
      setShowTransactions(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-details-container">
      <h2>Account Details</h2>
      <div className="account-info">
        <p>
          <strong>Account Name:</strong> {accountDetails.name}
        </p>
        <p>
          <strong>Account Number:</strong> {accountDetails.number}
        </p>
        <p>
          <strong>Balance:</strong> {accountDetails.balance}
        </p>
      </div>

      <button className="btn" onClick={fetchTransactions}>
        See Transactions
      </button>

      {showTransactions && (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {transaction.sourceAccount === accountId
                      ? "Outgoing"
                      : "Incoming"}
                  </td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="btn transfer-btn"
        onClick={() => navigate("/transfer")}
      >
        Transfer Money
      </button>
    </div>
  );
}
