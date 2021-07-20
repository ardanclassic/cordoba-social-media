import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import Loading from "assets/loader/list";
import { SetNameFromEmail } from "utils/helpers";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import "./style.scss";

const PeopleBox = () => {
  const { people } = useUserContext();
  const { currentUser } = useAuth();
  const [otherPeople, setotherPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (people && currentUser) {
      setLoading(false);
      const checkUser = people.filter((e) => e.email !== currentUser.email);
      if (checkUser) setotherPeople(checkUser);
    }
  }, [currentUser, people]);

  const setIconImage = (person) => {
    return person.gender === "male" ? (
      <img src={MaleAvatar} alt="icon-avatar" />
    ) : (
      <img src={FemaleAvatar} alt="icon-avatar" />
    );
  };

  const SetPeopleBox = () => {
    if (currentUser && otherPeople.length > 0) {
      return (
        <React.Fragment>
          <h5>Suggestion For You</h5>
          <div className="people-wrapper">
            {otherPeople.map((person) => {
              if (person.email !== currentUser.email) {
                return (
                  <Link
                    to={`/profile/${person.userID.slice(0, 5)}`}
                    key={person.userID}
                    className="person"
                  >
                    <div className="user-icon">
                      {person.userData.photoProfile ? (
                        <img
                          src={person.userData.photoProfile}
                          alt="user-icon"
                        />
                      ) : (
                        <div className="initial">
                          {setIconImage(person.userData)}
                        </div>
                      )}
                    </div>
                    <div className="username">
                      {person.userData.username
                        ? person.userData.username
                        : SetNameFromEmail(person.email)}
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </React.Fragment>
      );
    }

    return <div className="empty-user">Empty users . . .</div>;
  };

  return (
    <div className="people-box">
      <SetPeopleBox />
    </div>
  );
};

export default PeopleBox;
