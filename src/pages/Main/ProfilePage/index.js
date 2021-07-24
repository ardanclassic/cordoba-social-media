import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import ProfileLoader from "assets/loader/profile";
import ProfileHeader from "components/PROFILE_GROUP/ProfileHeader";
import ProfileContent from "components/PROFILE_GROUP/ProfileContent";
import "./style.scss";

const ProfilePage = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { people } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [thisUser, setThisUser] = useState(null);

  useEffect(() => {
    if (currentUser && people) {
      const getID = location.pathname.split("/")[2];
      if (getID) {
        const findUser = people.find((e) => e.userID.slice(0, 5) === getID);
        setLoading(false);
        setThisUser(findUser);
      } else {
        const findUser = people.find((e) => e.email === currentUser.email);
        if (findUser) {
          setLoading(false);
          setThisUser(findUser);
        } else {
          setLoading(false);
        }
      }
    }
  }, [location, people, currentUser]);

  const content = {
    thisUser,
    people,
    currentUser,
    setThisUser,
  };

  const HandleElement = () => {
    if (loading) {
      return (
        <div className="loading">
          <ProfileLoader />
        </div>
      );
    } else {
      if (thisUser) {
        return (
          <div className="profile-area">
            <ProfileHeader content={content} />
            <div className="divider"></div>
            <ProfileContent content={content} />
          </div>
        );
      } else {
        return (
          <div className="empty-profile">
            No Profile Found
          </div>
        );
      }
    }
  };

  return (
    <React.Fragment>
      <HandleElement />
    </React.Fragment>
  );
};

export default ProfilePage;
