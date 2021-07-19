import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cordoba from "assets/icons/cordoba-text.png";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import MainModal from "components/Modal/ConfirmModal";
import "./style.scss";

const Navbar = ({ show, setShow }) => {
  const { logout } = useAuth();
  const { people } = useUserContext();
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState();
  const [openmodal, setOpenmodal] = useState(false);

  useEffect(() => {
    if (people && currentUser) {
      const checkUser = people.find((e) => e.email === currentUser.email);
      setUserProfile(checkUser);
    }
  }, [people, currentUser]);

  const setIconImage = (person) => {
    return person.gender === "male" ? (
      <img src={MaleAvatar} alt="icon-avatar" />
    ) : (
      <img src={FemaleAvatar} alt="icon-avatar" />
    );
  };

  const handleLogout = (e) => {
    logout();
    setOpenmodal(false);
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
          <Link to="/profile" className="icons">
            {userProfile && (
              <div className="profile-wrapper">
                {userProfile.userData.photoProfile ? (
                  <img
                    src={userProfile.userData.photoProfile}
                    alt="user-icon"
                  />
                ) : (
                  <div className="initial">
                    {setIconImage(userProfile.userData)}
                  </div>
                )}
              </div>
            )}
          </Link>
          <div className="icons" onClick={() => setOpenmodal(true)}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>

      <MainModal data={{ ...content }} />
    </nav>
  );
};

export default Navbar;
