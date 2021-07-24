import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import Friendship from "assets/images/friendship.svg";
import CircleProfileImage from "components/CircleProfileImage";
import { Spinner } from "reactstrap";
import "./style.scss";
import { SetNameFromEmail } from "utils/helpers";

const ChannelBox = ({ content }) => {
  const history = useHistory();
  const { getChannels, deleteChannel, people } = useUserContext();
  const { sender, activeChannel, setTriggerEndLine } = content;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (function circleloop() {
      if (sender) {
        getChannels({ sender, type: "first-phase" }).then((collect) => {
          collect.onSnapshot((snap) => {
            getChannels({ snap, type: "second-phase" }).then((rooms) => {
              if (mounted) {
                setLoading(false);
                setChannels(rooms);
              }
            });
          });
        });
      }
      setTimeout(circleloop, 60 * 1000);
    })();
    return () => setMounted(false);
  }, [mounted, sender, getChannels, activeChannel]);

  const clickedChannel = (e, data) => {
    const getRecipient = data.users.find((e) => e.email !== sender.email);
    localStorage.setItem("activeChannel", JSON.stringify(getRecipient));
    history.push(`/chat/${getRecipient.id.slice(0, 5)}`);
    setTriggerEndLine(true);
  };

  const removeChannel = async (e, data) => {
    e.stopPropagation();
    setLoading(true);
    deleteChannel(data).then((result) => {
      if (result === "delete success!") {
        setLoading(false);
      }
    });
  };

  const handleActiveChannel = (current) => {
    if (activeChannel) {
      const currentID = current.users.find((e) => e.email !== sender.email).id;
      const activeID = activeChannel.userID;
      if (currentID === activeID) return "active";
      else return "";
    }
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

  const monitorChannel = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <Spinner />
        </div>
      );
    } else {
      if (channels.length > 0) {
        return channels.map((channel) => {
          const recipient = channel.users.find((e) => e.email !== sender.email);
          return (
            <React.Fragment key={channel.channelID}>
              <div
                className={`channel ${handleActiveChannel(channel)}`}
                onClick={(e) => clickedChannel(e, channel)}
              >
                <CircleProfileImage
                  data={{ email: recipient.email, size: 48 }}
                />
                <div className="desc-area">
                  {getUsername(recipient.email)}
                  <div className="time-updated">{channel.updated_at}</div>
                  {channel.unread > 0 && (
                    <div className="unread">{channel.unread}</div>
                  )}
                </div>
                <div
                  className="delete-channel"
                  onClick={(e) => removeChannel(e, channel)}
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
              </div>
            </React.Fragment>
          );
        });
      } else {
        return (
          <div className="blank-channel">
            <img src={Friendship} alt="friend-illustrator" />
            <div className="text">Go find ur friends!</div>
          </div>
        );
      }
    }
  };

  return <div className="channel-box">{monitorChannel()}</div>;
};

export default ChannelBox;
