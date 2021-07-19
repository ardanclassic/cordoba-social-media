import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import Friendship from "assets/images/friendship.svg";
import CircleProfileImage from "components/CircleProfileImage";
import { Link } from "react-router-dom";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import { Spinner } from "reactstrap";
import "./style.scss";

const ChannelBox = ({ content }) => {
  const history = useHistory();
  const { getChannels, deleteChannel } = useUserContext();
  const { sender, activeChannel } = content;
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
  }, [sender, getChannels, activeChannel]);

  const clickedChannel = (e, data) => {
    const id = data.users.find((e) => e.email !== sender.email).id.slice(0, 5);
    history.push(`/chat/${id}`);
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
          console.log(recipient);
          return (
            <React.Fragment key={channel.channelID}>
              <div
                className={`channel ${handleActiveChannel(channel)}`}
                onClick={(e) => clickedChannel(e, channel)}
              >
                
                <CircleProfileImage data={{ user: recipient, size: 48 }} />
                <div className="desc-area">
                  <div className="username">{recipient.username}</div>
                  <div className="time-updated">{channel.updated_at}</div>
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
