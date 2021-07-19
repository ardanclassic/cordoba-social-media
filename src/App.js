import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";

import MainPage from "pages/Main";
import SignIn from "pages/Auth/SignIn";
import SignUp from "pages/Auth/SignUp";
import ForgotPassword from "pages/Auth/ForgotPassword";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-modal/styles.css";
import "./styles.scss";

function App() {
  return (
    <div className="container">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/reset-password" component={ForgotPassword} />
            <MainPage />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
