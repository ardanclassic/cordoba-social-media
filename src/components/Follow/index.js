import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import { SetNameFromEmail } from "utils/helpers";
import { useAuth } from "contexts/AuthContext";

const Follow = ({ user, people }) => {
  const { followActivity } = useUserContext();
  const { currentUser } = useAuth();
  const [followStatus, setFollowStatus] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const loginUser = people.find((e) => e.email === currentUser.email);
      const loginUserFollowings = loginUser.userData.connections.followings;
      const userExist = loginUserFollowings.find((e) => e.email === user.email);
      userExist ? setFollowStatus(true) : setFollowStatus(false);
    }

    return () => {}
  }, [currentUser, user, people]);

  const followShip = async (type) => {
    const sender = {
      name: currentUser.displayName
        ? currentUser.displayName
        : SetNameFromEmail(currentUser.email),
      email: currentUser.email,
      id: currentUser.uid,
    };

    const recipient = {
      name: user.userData.name
        ? user.userData.name
        : SetNameFromEmail(user.email),
      email: user.email,
      id: user.userID,
    };

    await followActivity(sender, recipient, type).then((result) => {
      console.log(result)
      result === "success follow"
        ? setFollowStatus(true)
        : setFollowStatus(false);
    });
  };

  return (
    <React.Fragment>
      { !followStatus ? (
        <button className="button btn-send btn-follow" onClick={() => followShip("follow")}>Follow</button>
      ) : (
        <button className="button btn-send btn-unfollow" onClick={() => followShip("unfollow")}>Unfollow</button>
      )}
    </React.Fragment>
  );
};

export default Follow;
