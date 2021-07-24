import React, { useState, useEffect } from "react";
import FollowShip from "components/Follow";
import { SetNameFromEmail } from "utils/helpers";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import { useLocation, Link } from "react-router-dom";
import EditProfile from "components/Modal/ModalEditProfile";
import ModalFollow from "components/Modal/ModalFollow";
import "./style.scss";

const ProfileHeader = ({ content }) => {
  const location = useLocation();
  const { thisUser, setThisUser, people, currentUser } = content;
  const [openmodal, setOpenmodal] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowings, setOpenFollowings] = useState(false);
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
    if (currentUser && people) {
      if (mounted) {
        const getID = location.pathname.split("/")[2];
        if (getID) {
          const findUser = people.find((e) => e.userID.slice(0, 5) === getID);
          setThisUser(findUser);
        } else {
          const findUser = people.find((e) => e.email === currentUser.email);
          setThisUser(findUser);
        }
      }
    }

    return () => setmounted(false);
  }, [location, people, currentUser, setThisUser, mounted]);

  const dataedit = {
    openmodal,
    btnSubmit: "Update Profile",
    title: "Edit Profile",
    user: thisUser,
    setOpenmodal,
  };

  const contentFollowers = {
    openFollowers,
    setOpenFollowers,
    type: "followers",
    persons: thisUser.userData.connections.followers,
  };

  const contentFollowings = {
    openFollowings,
    setOpenFollowings,
    type: "followings",
    persons: thisUser.userData.connections.followings,
  };

  return (
    <div className="profile-header">
      <div className="image-area">
        {thisUser.userData.photoProfile ? (
          <img src={thisUser.userData.photoProfile} alt="profile-img" />
        ) : thisUser.userData.gender === "male" ? (
          <img src={MaleAvatar} alt="profile-img" />
        ) : (
          <img src={FemaleAvatar} alt="profile-img" />
        )}
      </div>
      <div className="description-area">
        <h3 className="user-name">
          {thisUser.userData.username
            ? thisUser.userData.username
            : SetNameFromEmail(thisUser.email)}
        </h3>
        <h3 className="user-occupation">
          {thisUser.userData.passion
            ? thisUser.userData.passion
            : "Mysterious Person"}
        </h3>
        <div className="socialism">
          <h3 className="user-follower">
            <div className="amount" onClick={() => setOpenFollowers(true)}>
              {thisUser.userData.connections.followers.length}
            </div>
            <div className="title">Followers</div>
          </h3>
          <h3 className="user-following">
            <div className="amount" onClick={() => setOpenFollowings(true)}>
              {thisUser.userData.connections.followings.length}
            </div>
            <div className="title">Following</div>
          </h3>
        </div>
        {thisUser.email !== currentUser.email ? (
          <>
            <FollowShip user={thisUser} people={people} />
            <Link
              to={`/chat/${location.pathname.split("/")[2]}`}
              className="button btn-message"
            >
              <i className="far fa-paper-plane"></i>
            </Link>
          </>
        ) : (
          <>
            <button
              className="button update-profile"
              onClick={() => setOpenmodal(true)}
            >
              Update Profile
            </button>
            <Link to={`/chat`} className="button btn-message">
              <i className="far fa-paper-plane"></i>
            </Link>
          </>
        )}
      </div>

      <EditProfile content={{ ...dataedit }} />
      {openFollowers && <ModalFollow data={{ ...contentFollowers }} />}
      {openFollowings && <ModalFollow data={{ ...contentFollowings }} />}
    </div>
  );
};

export default ProfileHeader;
