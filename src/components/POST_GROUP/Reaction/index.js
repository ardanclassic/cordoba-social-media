import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import CommentForm from "components/POST_GROUP/CommentForm";
import ShowComment from "../ShowComment";
import "./style.scss";

const Reaction = ({ dataReaction }) => {
  const { post, user, currentUser } = dataReaction;
  const {
    getLoginUser,
    getTotalComments,
    sendLike,
    sendUnlike,
    checkPostLike,
    getTotalLikes,
  } = useUserContext();
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getTotalComments({ post, user }).then((collect) => {
      collect.onSnapshot((snap) => {
        let comments = [];
        snap.forEach((doc) => {
          comments.push(doc.data());
        });
        if (isMounted) {
          setTotalComments(comments.length);
        }
      });
    });
    getTotalLikes({ post, user }).then((collect) => {
      collect.onSnapshot((snap) => {
        let totalLikes = [];
        snap.forEach((doc) => {
          totalLikes.push(doc.data());
        });
        if (isMounted) {
          setTotalLikes(totalLikes.length);
        }
      });
    });
    checkPostLike({
      postOwner: post.email,
      postID: post.contentID,
      sender: currentUser.email,
    }).then((collect) => {
      collect.onSnapshot((snap) => {
        if (snap.data() && isMounted) setLiked(true);
        if (!snap.data() && isMounted) setLiked(false);
      });
    });
    return () => (isMounted = false);
  }, [
    totalComments,
    totalLikes,
    getTotalComments,
    getTotalLikes,
    post,
    user,
    checkPostLike,
    currentUser,
    liked,
  ]);

  const likePost = async () => {
    setLiked(true);
    getLoginUser().then((loginuser) => {
      const data = {
        likeID: `like#${new Date().getTime()}`,
        postID: post.contentID,
        postOwner: post.email,
        sender: loginuser.email,
        senderID: loginuser.userID,
        senderName: loginuser.userData.username,
        senderImage: loginuser.userData.photoProfile
          ? loginuser.userData.photoProfile
          : null,
        senderGender: loginuser.userData.gender,
        created_at: new Date().getTime(),
      };
      sendLike(data).then((result) => result.status && setLiked(true));
    });
  };

  const unlikePost = async () => {
    setLiked(false);
    sendUnlike({
      postOwner: post.email,
      postID: post.contentID,
      sender: currentUser.email,
    }).then((result) => result.status && setLiked(false));
  };

  const LikeButton = () => {
    if (liked) {
      return (
        <button className="unlike" onClick={() => unlikePost()}>
          <i className="fas fa-heart"></i>
          Unlike
        </button>
      );
    }
    return (
      <button className="like" onClick={() => likePost()}>
        <i className="far fa-heart"></i>
        Like
      </button>
    );
  };

  return (
    <div className="reaction-area">
      <div className="button-area">
        <LikeButton />
        <button
          className="btn-comment"
          onClick={() => setShowComment(!showComment)}
        >
          <i className="far fa-comment"></i>
          {totalComments > 0 ? totalComments : ""}
          <span className="text"> Comments</span>
        </button>
      </div>
      {totalLikes > 0 && (
        <div className="total-likes">{totalLikes} people like this post!</div>
      )}
      {showComment && (
        <div className="comment-area">
          <CommentForm data={{ post, user }} />
          <ShowComment data={{ post, user, showComment, currentUser }} />
        </div>
      )}
    </div>
  );
};

export default Reaction;
