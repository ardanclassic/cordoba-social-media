import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import { useAuth } from "contexts/AuthContext";
import PostParent from "..";
import moment from "moment";
import "./style.scss";

const AllPostData = ({ userlogin }) => {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { getAllPostData, getThisUser } = useUserContext();
  const [allPost, setAllPost] = useState([]);

  useEffect(() => {
    setMounted(true);
    const userfollowings = userlogin.userData.connections.followings;
    const process = (userdata) => {
      getAllPostData(userdata).then((collectData) => {
        collectData.onSnapshot(async (snapData) => {
          snapData.docChanges().forEach((change) => {
            const changeData = change.doc.data();
            const changeType = change.type;
            getThisUser(changeData).then((user) => {
              changeData.userlog = user;
              if (changeType === "added") {
                if (mounted) {
                  setAllPost((prevPost) => {
                    const exist = prevPost.find((prev) => {
                      return prev.contentID === changeData.contentID;
                    });
                    if (!exist) return [...prevPost, changeData];
                    else return [...prevPost];
                  });
                }
              } else if (changeType === "removed") {
                if (mounted) {
                  setAllPost((prevPost) => {
                    const exist = prevPost.find((prev) => {
                      return prev.contentID === changeData.contentID;
                    });
                    if (exist) {
                      const eliminateArray = prevPost.filter((prev) => {
                        return prev.contentID !== exist.contentID;
                      });
                      return [...eliminateArray];
                    } else {
                      return [...prevPost];
                    }
                  });
                }
              } else if (changeType === "modified") {
                if (mounted) {
                  setAllPost((prevPost) => {
                    const exist = prevPost.find((prev) => {
                      return prev.contentID === changeData.contentID;
                    });
                    if (exist) {
                      const eliminateArray = prevPost.filter((prev) => {
                        return prev.contentID !== exist.contentID;
                      });
                      return [...eliminateArray, changeData];
                    } else return [...prevPost];
                  });
                }
              }
            });
          });
        });
      });
    };

    process(userlogin);
    userfollowings.forEach((userfollow) => process(userfollow));

    return () => setMounted(false);
  }, [getAllPostData, mounted, userlogin, getThisUser]);

  const handleAllPosts = () => {
    const sortedPost = allPost.sort((a, b) => b.created_at - a.created_at);
    return sortedPost.map((post) => {
      const dataContent = {
        ...post,
        hoursDuration: moment().diff(moment(post.created_at), "hours"),
        daysDuration: moment().diff(moment(post.created_at), "days"),
        updated_at: moment(post.created_at).format("LL"),
        timeFormat: moment(post.created_at).format("hh:mm A"),
        fromNow: moment(post.created_at).fromNow(),
      };
      // console.log(dataContent);

      return (
        <PostParent
          key={post.contentID}
          datapost={{ post: dataContent, user: post.userlog, currentUser }}
        />
      );
    });
  };

  return <div className="allpost-area">{handleAllPosts()}</div>;
};

export default AllPostData;
