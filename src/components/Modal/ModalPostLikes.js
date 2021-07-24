import CircleProfileImage from "components/CircleProfileImage";
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { useHistory } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { SetNameFromEmail } from "utils/helpers";
import moment from "moment";

const ModalPostLikes = ({ data }) => {
  const history = useHistory();
  const { openLikeModal, setOpenLikeModal, post, user, getDataLikes } = data;
  const { people } = useUserContext();
  const [mounted, setmounted] = useState(false);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    setmounted(true);
    if (data && mounted) {
      getDataLikes({ post, user }).then((collect) => {
        collect.onSnapshot((snap) => {
          let totalLikes = [];
          snap.forEach((doc) => {
            totalLikes.push(doc.data());
          });
          setPersons(totalLikes);
        });
      });
    }
    return () => {
      setmounted(false);
    };
  }, [data, mounted, post, user, getDataLikes]);

  const TimeFormat = (data) => {
    const hoursDuration = moment().diff(moment(data.created_at), "hours");
    const daysDuration = moment().diff(moment(data.created_at), "days");
    if (daysDuration < 1) {
      if (hoursDuration > 6) {
        return <div className="created-at">{data.timeFormat}</div>;
      }
      return <div className="created-at">{data.fromNow}</div>;
    }
    return (
      <div className="created-at">
        {data.created_at} at {data.timeFormat}
      </div>
    );
  };

  const getUsername = (email) => {
    if (people) {
      const findUser = people.find((e) => e.email === email);
      return (
        <div className="username">
          {findUser.userData.username
            ? findUser.userData.username
            : SetNameFromEmail(findUser.email)}
        </div>
      );
    }
    return null;
  };

  const ListPersons = () => {
    if (persons) {
      return (
        <div className="like-area">
          {persons.map((person) => {
            const time = {
              hoursDuration: moment().diff(moment(person.created_at), "hours"),
              daysDuration: moment().diff(moment(person.created_at), "days"),
              updated_at: moment(person.created_at).format("LL"),
              timeFormat: moment(person.created_at).format("hh:mm A"),
              fromNow: moment(person.created_at).fromNow(),
            };
            return (
              <div
                key={person.likeID}
                className="person"
                onClick={() =>
                  history.push(`/profile/${person.senderID.slice(0, 5)}`)
                }
              >
                <CircleProfileImage data={{ email: person.sender, size: 40 }} />
                <div className="desc-area">
                  {getUsername(person.sender)}
                  {TimeFormat(time)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const onCloseModal = () => setOpenLikeModal(false);

  return (
    <Modal open={openLikeModal} onClose={onCloseModal} center>
      <div className="confirm-area">
        <div className="text">People who like your post</div>
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

export default ModalPostLikes;
