import React, { useEffect, useState } from "react";
import { useUserContext } from "contexts/UserContext";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import { Link } from "react-router-dom";
import "./style.scss";

const CircleProfileImage = ({ data }) => {
  const [imageProfile, setImageProfile] = useState();
  const { people } = useUserContext();
  const [userInfo, setUserInfo] = useState();
  const { email, size, style } = data;

  useEffect(() => {
    if (people) {
      const findUser = people.find((e) => e.email === email);
      setUserInfo(findUser);
      if (userInfo) {
        userInfo.userData.gender === "male"
          ? setImageProfile(MaleAvatar)
          : setImageProfile(FemaleAvatar);

        if (userInfo.userData.photoProfile) {
          setImageProfile(userInfo.userData.photoProfile);
        }
      }
    }
  }, [people, userInfo, email]);

  if (userInfo) {
    return (
      <div
        className="profile-image"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Link to={`/profile/${userInfo.userID.slice(0, 5)}`}>
          <img src={imageProfile} alt="icon-profile" />
        </Link>
      </div>
    );
  }
  return null;
};

export default CircleProfileImage;
