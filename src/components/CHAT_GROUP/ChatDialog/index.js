import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "contexts/UserContext";
import PeopleSearch from "assets/images/people-search.svg";
import Linkify from "react-linkify";
import { Spinner } from "reactstrap";
import { SetNameFromEmail } from "utils/helpers";
import "./style.scss";

const ChatDialog = ({ dataDialog }) => {
  let endline = useRef(null);
  const prevScrollY = useRef(0);
  const { readChat, deleteChat, setSenderTypingStatus, checkTypingStatus } =
    useUserContext();

  const {
    sender,
    recipient,
    handleReadChat,
    triggerInit,
    setLoading,
    loading,
    typing,
    typer,
    setTyper,
    triggerEndLine,
    setTriggerEndLine,
    dialogHeight,
  } = dataDialog;

  const [mounted, setMounted] = useState(false);
  const [dialog, setDialog] = useState([]);
  const [maxTop, setMaxTop] = useState(false);
  const [goingUp, setGoingUp] = useState(false);
  const [showEndArrow, setShowEndArrow] = useState(false);
  const [latestChat, setLatestChat] = useState(10);

  useEffect(() => {
    setMounted(true);
    if ((sender, recipient)) {
      const handleReadChat = () => {
        readChat({
          sender,
          recipient,
          latestChat,
          type: "first-phase",
        })
          .then((collect) => {
            collect.onSnapshot((snap) => {
              readChat({ snap, type: "second-phase" }).then((chats) => {
                if (mounted) {
                  setLoading(false);
                  setDialog(chats);
                  if (endline.current) {
                    if (triggerEndLine) {
                      endline.current.scrollIntoView();
                      setTriggerEndLine(false);
                      setMaxTop(false);
                    }
                  }
                }
              });
            });
          })
          .catch((err) => {
            setLoading(false);
          });
      };

      handleReadChat();
      if (triggerInit) handleReadChat();

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
    }

    return () => setMounted(false);
  }, [
    mounted,
    sender,
    recipient,
    checkTypingStatus,
    handleReadChat,
    setTyper,
    setSenderTypingStatus,
    typing,
    readChat,
    triggerInit,
    setLoading,
    latestChat,
    triggerEndLine,
    setTriggerEndLine,
  ]);

  const onScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (prevScrollY.current < currentScrollY && goingUp) {
      setGoingUp(false);
    }
    if (prevScrollY.current > currentScrollY && !goingUp) {
      setGoingUp(true);
    }
    prevScrollY.current = currentScrollY;

    const countScroll = Math.round(e.target.scrollHeight - currentScrollY);

    if (countScroll > 700) setShowEndArrow(true);
    if (countScroll < 700) setShowEndArrow(false);

    if (currentScrollY === 0) {
      setMaxTop(true);
      if (maxTop && !triggerEndLine) {
        setLatestChat(latestChat + 10);
      }
    } else if (currentScrollY > 0 && currentScrollY < 10) {
      setMaxTop(true);
    }
  };

  const ShowWhoTyping = () => {
    return (
      typer &&
      typer.email !== sender.email && (
        <div className="typer-status">
          {typer.username ? typer.username : SetNameFromEmail(typer.email)}
          <span> is typing . . .</span>
        </div>
      )
    );
  };

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

  return (
    <div
      onScroll={onScroll}
      className="dialog-window"
      style={{ height: `calc(${dialogHeight})` }}
    >
      {monitorChatRoom()}
      <div ref={endline} id="endline"></div>

      <div
        className={`toendline ${showEndArrow ? "show" : "hide"}`}
        onClick={() => endline.current.scrollIntoView()}
      >
        <i className="fas fa-arrow-circle-down"></i>
      </div>
    </div>
  );
};

export default ChatDialog;
