import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Accounts() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/accounts/get-accounts?userId=${user.id}`,
          config
        );
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [user, refresh]);

  const handleAccountClick = (accountId) => {
    navigate(`/account-details/${accountId}`);
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/accounts/${accountId}`,
        config
      );
      setRefresh(!refresh);
    } catch (error) {
      console.error(`Account with ID ${accountId} deletion error`, error);
    }
  };

  return (
    <div className="page-container">
      <div className="welcome">Your Accounts</div>
      {accounts.length > 0 ? (
        <table className="account-table">
          <thead>
            <tr>
              <th className="account-number">Account No</th>
              <th className="account-name">Account Name</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr
                key={account.uuid}
                onClick={() => handleAccountClick(account.id)}
              >
                <td className="account-number">{account.number}</td>
                <td className="account-name">{account.name}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAccount(account.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-accounts">No accounts found</div>
      )}
      <div className="navigate-button-container">
        <Link to="/add-account" className="navigate-link">
          Add Account
        </Link>
      </div>
    </div>
  );
}
