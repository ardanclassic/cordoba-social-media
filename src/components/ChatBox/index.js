import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import PeopleSearch from "assets/images/people-search.svg";
import autosize from "autosize";
import Linkify from "react-linkify";
import { Spinner } from "reactstrap";
import "./style.scss";

const ChatBox = ({ content }) => {
  const location = useLocation();
  let inputRef = useRef(null);
  let endline = useRef(null);

  const { sendMessage, readChat, deleteChat } = useUserContext();
  const { sender, recipient } = content;
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dialogWindowHeight, setdialogWindowHeight] = useState();

  useEffect(() => {
    setMounted(true);
    inputRef.current.focus();
    autosize(document.querySelector("textarea"));
    setdialogWindowHeight(
      document.querySelector(".dialog-window").offsetHeight
    );

    if (sender && recipient) handleReadChat();
    else {
      if (!location.pathname.split("/")[2]) {
        setLoading(false);
      }
    }
    return () => setMounted(false);
  }, [sender, recipient, readChat, dialogWindowHeight]);

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
                          onClick={() => removeChat(chat)}
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

  const removeChat = (data) => {
    deleteChat(data);
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

  const adjustRoomHeight = () => {
    const dialogWindow = document.querySelector(".dialog-window");
    const textArea = document.querySelector("textarea");
    dialogWindow.style.height = `${
      dialogWindowHeight + 50 - textArea.clientHeight
    }px`;
  };

  const handleKeyDown = (e) => {
    adjustRoomHeight();
    if (e.key === "Enter" && e.shiftKey) {
    } else if (e.key === "Enter") {
      document.querySelector("textarea").style.height = `50px`;
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sender && recipient && message) {
      setLoading(true);
      setMessage("");
      const created = new Date();
      const status = "unread";
      const data = { sender, recipient, message, created, status };
      sendMessage(data).then((result) => {
        if (result === "create") handleReadChat();
      });
    } else {
      setMessage("");
    }
  };

  return (
    <div className="chatbox">
      <div className="dialog-window">
        {monitorChatRoom()}
        <div ref={endline} id="endline"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          required
          name="chatinput"
          className="input chatinput"
          placeholder="write your chat . . ."
          onKeyUp={(e) => adjustRoomHeight(e)}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>

        <button className="send-chat" type="submit">
          <i className="far fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
