import React, { useState } from "react";
import Navbar from "components/Navbar";
import Dashboard from "pages/Main/Dashboard";
import ProfilePage from "pages/Main/ProfilePage";
import { UserProvider } from "contexts/UserContext";
import PrivateRoute from './PrivateRoute'
import Chatting from "./Chat";
import "./main-style.scss";

const MainPage = () => {
  const [show, setShow] = useState(false);

  return (
    <UserProvider>
      <div className="common-container">
        <Navbar show={show} setShow={setShow} />
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <PrivateRoute path="/chat" component={Chatting} />
      </div>
    </UserProvider>
  );
};

export default MainPage;
