import React, { useEffect, useState } from "react";
import { useUserContext } from "contexts/UserContext";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import { Link } from "react-router-dom";
import "./style.scss";

const CircleProfileImage = ({ data }) => {
  const [imageProfile, setImageProfile] = useState();
  const { people } = useUserContext();
  const { user, size } = data;

  useEffect(() => {
    if (user.userData) {
      user.userData.gender === "male"
        ? setImageProfile(MaleAvatar)
        : setImageProfile(FemaleAvatar);

      if (user.userData.photoProfile) {
        setImageProfile(user.userData.photoProfile);
      }
    } else {
      if (people) {
        const findUser = people.find((e) => e.email === user.email);
        findUser.userData.gender === "male"
          ? setImageProfile(MaleAvatar)
          : setImageProfile(FemaleAvatar);

        if (findUser.userData.photoProfile) {
          setImageProfile(findUser.userData.photoProfile);
        }
      }
    }
  }, [user, people]);

  return (
    <div
      className="profile-image"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Link to={`/profile/${user.userID ? user.userID.slice(0, 5) : user.id.slice(0, 5)}`}>
        <img src={imageProfile} alt="icon-profile" />
      </Link>
    </div>
  );
};

export default CircleProfileImage;
