import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "contexts/UserContext";
import { DebounceInput } from "react-debounce-input";
import autosize from "autosize";
import "./style.scss";

const ChatInput = ({ dataChat }) => {
  const {
    sender,
    recipient,
    setLoading,
    setTyping,
    setTyper,
    setTriggerEndLine,
    setTriggerInit,
    setDialogHeight,
  } = dataChat;

  const { sendMessage } = useUserContext();

  let inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    inputRef.current.focus();
    autosize(inputRef.current);

    if (mounted) {
      setDialogHeight(
        inputRef.current
          ? `${98}% - ${inputRef.current.offsetHeight}px`
          : `${98}% - 125px`
      );
    }

    return () => setMounted(false);
  }, [mounted, setDialogHeight]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
    } else if (e.key === "Enter") {
      inputRef.current.style.height = `50px`;
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key !== "Alt") {
      setTyping(true);
    }
  };

  const handleChange = (text) => {
    setMessage(text);
    setTyping(false);
    setTyper(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sender && recipient && message) {
      setTyping(false);
      setLoading(true);
      setTriggerEndLine(true);
      setMessage("");
      const created = new Date();
      const status = "unread";
      const data = { sender, recipient, message, created, status };

      sendMessage(data).then((result) => {
        if (result === "create") {
          setLoading(true);
          setTriggerInit(true);
        } else if (result === "update") {
          setTriggerInit(false);
        }
      });
    } else {
      setMessage("");
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <DebounceInput
          element="textarea"
          minLength={1}
          debounceTimeout={700}
          inputRef={inputRef}
          required
          name="chatinput"
          className="input chatinput"
          placeholder="write your chat . . ."
          onKeyUp={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => handleChange(e.target.value)}
          value={message}
        />

        <button className="send-chat" type="submit">
          <i className="far fa-paper-plane"></i>
        </button>
      </form>
    </React.Fragment>
  );
};

export default ChatInput;
