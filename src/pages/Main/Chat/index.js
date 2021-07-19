import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import ChatBox from "components/ChatBox";
import ChannelBox from "components/ChannelBox";
import "./style.scss";

const Chatting = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { people } = useUserContext();
  const [recipient, setRecipient] = useState(null);
  const [sender, setSender] = useState(null);
  const [activeChannel, setActiveChannel] = useState();

  useEffect(() => {
    const unsubscribe = () => {
      if (currentUser && people) {
        const getID = location.pathname.split("/")[2];
        if (getID) {
          const findRecipient = people.find(
            (e) => e.userID.slice(0, 5) === getID
          );
          setActiveChannel(findRecipient);
          setRecipient(findRecipient);
        }
        const findSender = people.find((e) => e.email === currentUser.email);
        setSender(findSender);
      }
    };

    return unsubscribe();
  }, [location, people, currentUser, recipient]);

  const content = {
    sender,
    recipient,
    activeChannel,
  };

  return (
    <React.Fragment>
      <div className="main-box">
        <ChannelBox content={content} />
        <ChatBox content={content} />
      </div>
    </React.Fragment>
  );
};

export default Chatting;
