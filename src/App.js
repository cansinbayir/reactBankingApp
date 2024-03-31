import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/TransferMoney";
import AddAccount from "./pages/AddAccount";
import AccountDetails from "./pages/AccountDetails";
import TransferCompleted from "./pages/TransferCompleted";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Initialize user as null

  //page refresh
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        const user = {
          id: decodedToken.uuid,
          userName: decodedToken.sub,
          //the last transaction state of a user, to display message on transfer complete.
          lastTransactionResult: false,
        };
        setUser(user);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle error (e.g., redirect to login)
      }
    }
  }, []);

  const data = { user, setUser };
  return (
    <Router>
      <UserContext.Provider value={data}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/add-account" element={<AddAccount />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/transfer-completed" element={<TransferCompleted />} />
          <Route
            path="/account-details/:accountId"
            element={<AccountDetails />}
          />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
