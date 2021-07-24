import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cordoba from "assets/icons/cordoba-text.png";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import ConfirmModal from "components/Modal/ConfirmModal";
import CircleProfileImage from "components/CircleProfileImage";
import "./style.scss";

const Navbar = ({ show, setShow }) => {
  const { logout } = useAuth();
  const { people, getChatNotif } = useUserContext();
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState();
  const [openmodal, setOpenmodal] = useState(false);
  const [chatNotif, setChatNotif] = useState(false);

  useEffect(() => {
    if (people && currentUser) {
      getChatNotif().then((collect) => {
        collect.onSnapshot((snap) => {
          let channels = [];
          snap.forEach((channel) => channels.push(channel.data()));
          const check = channels.find((c) => c.unread > 0);
          if (check) setChatNotif(true);
          else setChatNotif(false);
        });
      });
      const checkUser = people.find((e) => e.email === currentUser.email);
      setUserProfile(checkUser);
    }
  }, [people, currentUser, getChatNotif]);

  const handleLogout = (e) => {
    logout();
    setOpenmodal(false);
  };

  const IconChat = () => {
    return (
      <Link to="/chat" className="icons">
        <div className="chat-logo">
          {chatNotif && <div className="notif-dot"></div>}
          <i className="fas fa-comments"></i>
        </div>
      </Link>
    );
  };

  const IconProfile = () => {
    if (userProfile) {
      return (
        <div className="icons">
          <CircleProfileImage
            data={{
              email: userProfile.email,
              size: 32,
            }}
          />
        </div>
      );
    }
    return null;
  };

  const IconSignOut = () => {
    return (
      <div className="icons" onClick={() => setOpenmodal(true)}>
        <i className="fas fa-sign-out-alt"></i>
      </div>
    );
  };

  const content = {
    openmodal,
    btnConfirm: "Yes, I'm Out!",
    confirm: "You want to sign out?",
    setOpenmodal,
    actionSubmit: handleLogout,
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-content">
        <Link to="/" className="navbar-header">
          <img className="icon-brand" src={Cordoba} alt="logo-icon" />
        </Link>
        <div className="navbar-items">
          <IconChat />
          <IconProfile />
          <IconSignOut />
        </div>
      </div>

      <ConfirmModal data={{ ...content }} />
    </nav>
  );
};

export default Navbar;
