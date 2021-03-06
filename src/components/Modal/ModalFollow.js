import CircleProfileImage from "components/CircleProfileImage";
import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import { Modal } from "react-responsive-modal";
import { useHistory } from "react-router-dom";
import { SetNameFromEmail } from "utils/helpers";

const ModalFollow = ({ data }) => {
  const history = useHistory();
  const { people } = useUserContext();
  const [mounted, setmounted] = useState(false);
  const {
    openFollowers,
    openFollowings,
    setOpenFollowers,
    setOpenFollowings,
    persons,
  } = data;

  useEffect(() => {
    setmounted(true);
    return () => setmounted(false);
  }, [data, mounted]);

  const getUsername = (email) => {
    if (people) {
      const findUser = people.find((e) => e.email === email);
      if (findUser) {
        return (
          <div className="username">
            {findUser.userData.username
              ? findUser.userData.username
              : SetNameFromEmail(findUser.email)}
          </div>
        );
      } else {
        return <div className="username">{SetNameFromEmail(email)}</div>;
      }
    }
    return null;
  };

  const ListPersons = () => {
    if (persons) {
      return (
        <div className="person-area">
          {persons.map((person) => {
            return (
              <div
                key={person.email}
                className="person"
                onClick={() =>
                  history.push(`/profile/${person.id.slice(0, 5)}`)
                }
              >
                <CircleProfileImage data={{ email: person.email, size: 36 }} />
                <div className="desc-area">{getUsername(person.email)}</div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const onCloseModal = () => {
    openFollowers && setOpenFollowers(false);
    openFollowings && setOpenFollowings(false);
  };

  return (
    <Modal open={openFollowers || openFollowings} onClose={onCloseModal} center>
      <div className="confirm-area">
        <h3>{openFollowers ? "The Followers" : "The Followings"}</h3>
        <ListPersons />
        <div className="button-area">
          <button className="confirm" onClick={onCloseModal}>
            Got It!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFollow;
