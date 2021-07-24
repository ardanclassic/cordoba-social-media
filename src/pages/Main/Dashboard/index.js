import React, { useState, useEffect } from "react";
import PeopleBox from "components/PeopleBox";
import StatusPost from "components/POST_GROUP/StatusPost";
import { Link } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import { SetNameFromEmail } from "utils/helpers";
import DashboardLoader from "assets/loader/dashboard";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import AllPostData from "components/POST_GROUP/AllPostData";
import "./style.scss";

const Dashboard = () => {
  const { people, getLoginUser } = useUserContext();
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const milli = moment("19-07-2021, 09.07", "DD-MM-YYYY, HH:mm").valueOf();
    // console.log(milli);
    if (people && currentUser) {
      getLoginUser().then((user) => {
        // setLoading(false);
        setUserProfile(user);
      });
    }
  }, [people, currentUser, getLoginUser]);

  const ProfileBox = () => {
    if (userProfile) {
      return (
        <div className="user-profile">
          <div to="profile" className="user-icon">
            <Link to="profile" className="name">
              <img
                src={
                  userProfile.userData.photoProfile
                    ? userProfile.userData.photoProfile
                    : userProfile.userData.gender === "male"
                    ? MaleAvatar
                    : FemaleAvatar
                }
                alt="icon-profile"
              />
            </Link>
          </div>
          <Link to="profile" className="name">
            {userProfile.userData.username
              ? userProfile.userData.username
              : SetNameFromEmail(currentUser.email)}
            <div className="passion">
              {userProfile && userProfile.userData.passion}
            </div>
          </Link>
        </div>
      );
    }
    return null;
  };

  const ShowDashboard = () => {
    if (userProfile) {
      return (
        <React.Fragment>
          <div className="left-area">
            <ProfileBox />
            <PeopleBox />
          </div>
          <div className="center-area">
            <StatusPost userProfile={userProfile} />
            <AllPostData userlogin={userProfile} />
          </div>
          <div className="right-area">
            <div className="group-suggestion"></div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <div className="loader">
          <DashboardLoader />
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      <ShowDashboard />
    </div>
  );
};

export default Dashboard;
