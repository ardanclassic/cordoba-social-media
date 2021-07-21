import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";

import MainPage from "pages/Main";
import SignIn from "pages/Auth/SignIn";
import SignUp from "pages/Auth/SignUp";
import ForgotPassword from "pages/Auth/ForgotPassword";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-modal/styles.css";
import MobileScreen from "assets/images/mobile-screen.svg";
import "./styles.scss";

function App() {
  return (
    <React.Fragment>
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
      <div className="mobile-container">
        <img src={MobileScreen} alt="pic-illustration" />
        <div className="text">
          Mobile version is not available yet. <br /> Please change your device.
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
