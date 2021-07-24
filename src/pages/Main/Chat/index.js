import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import ChatBox from "components/CHAT_GROUP/ChatBox";
import ChannelBox from "components/CHAT_GROUP/ChannelBox";
import "./style.scss";

const Chatting = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { people } = useUserContext();
  const [recipient, setRecipient] = useState(null);
  const [sender, setSender] = useState(null);
  const [initFirstChat, setInitFirstChat] = useState(true);
  const [activeChannel, setActiveChannel] = useState();
  const [triggerEndLine, setTriggerEndLine] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (currentUser && people) {
      const getID = location.pathname.split("/")[2];
      if (getID) {
        const findRecipient = people.find(
          (e) => e.userID.slice(0, 5) === getID
        );
        mounted && setActiveChannel(findRecipient);
        mounted && setRecipient(findRecipient);
      }
      const findSender = people.find((e) => e.email === currentUser.email);
      mounted && setSender(findSender);
    }

    return () => (mounted = false);
  }, [location, people, currentUser]);

  const content = {
    sender,
    recipient,
    activeChannel,
    initFirstChat,
    triggerEndLine,
    setInitFirstChat,
    setTriggerEndLine,
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
