import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import PeopleSearch from "assets/images/people-search.svg";
import autosize from "autosize";
import Linkify from "react-linkify";
import { Spinner } from "reactstrap";
import { DebounceInput } from "react-debounce-input";
import "./style.scss";
import { SetNameFromEmail } from "utils/helpers";

const ChatBox = ({ content }) => {
  const location = useLocation();
  let inputRef = useRef(null);
  let endline = useRef(null);

  const {
    sendMessage,
    readChat,
    deleteChat,
    setSenderTypingStatus,
    checkTypingStatus,
  } = useUserContext();
  const { sender, recipient } = content;
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typer, setTyper] = useState(null);
  const [dialogWindowHeight, setdialogWindowHeight] = useState();

  useEffect(() => {
    setMounted(true);
    inputRef.current.focus();
    autosize(inputRef.current);
    setdialogWindowHeight(
      document.querySelector(".dialog-window").offsetHeight + 50
    );

    if (sender && recipient) {
      handleReadChat();
      setSenderTypingStatus({ sender, recipient, status: typing });
      checkTypingStatus({ sender, recipient }).then((collect) => {
        collect.onSnapshot((snap) => {
          if (snap.data()) {
            const typingStatus = snap.data().typing;
            if (typingStatus) mounted && setTyper(typingStatus);
            else mounted && setTyper(null);
          }
        });
      });
    } else {
      if (!location.pathname.split("/")[2]) {
        setLoading(false);
      }
    }
    return () => setMounted(false);
  }, [
    sender,
    recipient,
    readChat,
    dialogWindowHeight,
    location,
    checkTypingStatus,
    typing,
    mounted,
    setSenderTypingStatus,
  ]);

  const monitorChatRoom = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <Spinner color="light" />
        </div>
      );
    } else {
      if (sender && recipient) {
        if (dialog.length > 0) {
          return dialog.map((day) => {
            const date = day[0].created_at;
            return (
              <React.Fragment key={date}>
                <div className="divider-area">
                  <div className="item linebar"></div>
                  <div className="item dateblock">{date}</div>
                </div>
                {day.map((chat) => {
                  const fromMe = chat.sender === sender.email;
                  return (
                    <div
                      key={chat.roomID}
                      id={chat.roomID}
                      className="chat-item"
                    >
                      <div className={`text ${fromMe ? "from-me" : "other"}`}>
                        <div
                          className="remove"
                          onClick={() => deleteChat(chat)}
                        >
                          <i className="far fa-trash-alt"></i>
                        </div>
                        <Linkify
                          componentDecorator={(
                            decoratedHref,
                            decoratedText,
                            key
                          ) => (
                            <a
                              target="blank"
                              href={decoratedHref}
                              key={key}
                              className="linkify-text"
                            >
                              {decoratedText}
                            </a>
                          )}
                        >
                          {chat.message}
                        </Linkify>
                        <div className="time">{chat.timeCreated}</div>
                      </div>
                    </div>
                  );
                })}
                <ShowWhoTyping />
              </React.Fragment>
            );
          });
        } else {
          return <div className="first-chat">Start your chat . . .</div>;
        }
      } else {
        return (
          <div className="blank-chat">
            <img src={PeopleSearch} alt="search-illustration" />
            <div className="text">
              Select channel or user to start conversation
            </div>
          </div>
        );
      }
    }
  };

  const handleReadChat = () => {
    readChat({ sender, recipient, type: "first-phase" })
      .then((collect) => {
        collect.onSnapshot((snap) => {
          readChat({ snap, type: "second-phase" }).then((chats) => {
            if (mounted) {
              setLoading(false);
              setDialog(chats);
              if (endline.current) {
                endline.current.scrollIntoView();
              }
            }
          });
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const ShowWhoTyping = () => {
    return (
      typer &&
      typer.email !== sender.email && (
        <div className="typer-status">
          {typer.username
            ? typer.username
            : SetNameFromEmail(typer.email)}
          <span> is typing . . .</span>
        </div>
      )
    );
  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && e.shiftKey) {
    } else if (e.key === "Enter") {
      inputRef.current.style.height = `50px`;
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key !== "Alt") {
      // console.log(e.key);
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
      setMessage("");
      const created = new Date();
      const status = "unread";
      const data = { sender, recipient, message, created, status };
      sendMessage(data).then(
        (result) => result === "create" && handleReadChat()
      );
    } else {
      setMessage("");
    }
  };

  const dh = inputRef.current
    ? `${98}% - ${inputRef.current.offsetHeight}px`
    : `${98}% - 125px`;

  return (
    <div className="chatbox">
      <div className="chat-wrapper">
        <div className="dialog-window" style={{ height: `calc(${dh})` }}>
          {monitorChatRoom()}
          <div ref={endline} id="endline"></div>
        </div>

        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default ChatBox;
