import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import ChatInput from "components/CHAT_GROUP/ChatInput";
import ChatDialog from "components/CHAT_GROUP/ChatDialog";
import "./style.scss";

const ChatBox = ({ content }) => {
  const location = useLocation();
  const { sender, recipient } = content;
  const { readChat } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [triggerInit, setTriggerInit] = useState(false);
  const [triggerEndLine, setTriggerEndLine] = useState(true);
  const [typer, setTyper] = useState(null);
  const [dialogHeight, setDialogHeight] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!location.pathname.split("/")[2]) {
      setLoading(false);
    }
    return () => setMounted(false);
  }, [mounted, sender, recipient, readChat, location]);

  const dataChat = {
    sender,
    recipient,
    setTriggerEndLine,
    setLoading,
    setTyping,
    setTyper,
    setTriggerInit,
    setDialogHeight,
  };

  const dataDialog = {
    sender,
    recipient,
    loading,
    typing,
    typer,
    dialogHeight,
    triggerInit,
    triggerEndLine,
    setTyper,
    setTriggerEndLine,
    setLoading,
  };

  return (
    <div className="chatbox">
      <div className="chat-wrapper">
        <ChatDialog dataDialog={dataDialog} />
        <ChatInput dataChat={dataChat} />
      </div>
    </div>
  );
};

export default ChatBox;
