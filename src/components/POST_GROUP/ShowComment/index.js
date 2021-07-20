import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import CircleProfileImage from "components/CircleProfileImage";
import DropdownSelect from "components/Dropdown";
import EditComment from "components/Modal/EditComment";
import { Spinner } from "reactstrap";
import { SetNameFromEmail } from "utils/helpers";
import "./style.scss";

const ShowComment = ({ data }) => {
  const { showComment, post, user, currentUser } = data;
  const { getComments, deleteComment, getThisUser } = useUserContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openmodal, setOpenmodal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getComments({ post, user, type: "first-phase" }).then((collect) => {
      collect.onSnapshot((snap) => {
        getComments({ snap, type: "second-phase" }).then((commentdata) => {
          if (isMounted) {
            setLoading(false);
            setComments(commentdata);
          }
        });
      });
    });
    if (showComment) {
    }
    return () => (isMounted = false);
  }, [getComments, post, user, showComment]);

  const TimeFormat = ({ data }) => {
    if (data.daysDuration < 1) {
      if (data.hoursDuration > 6) {
        return <div className="created-at">{data.timeFormat}</div>;
      }
      return <div className="created-at">{data.fromNow}</div>;
    }
    return (
      <div className="created-at">
        {data.created_at} at {data.timeFormat}
      </div>
    );
  };

  const modalContent = {
    openmodal,
    btnConfirm: "Update",
    setOpenmodal,
  };

  const HandleDropdownCase = ({ comment }) => {
    const myPost = post.email === currentUser.email;
    const myComment = currentUser.email === comment.sender;
    const myPost_myComment = myPost && myComment;
    const myPost_otherComment = myPost && !myComment;
    const otherPost_myComment = !myPost && myComment;

    if (myPost_myComment || myPost_otherComment || otherPost_myComment) {
      return (
        <DropdownSelect
          data={{
            items: [
              {
                id: "edit",
                name: "Edit Comment",
                icon: <i className="fas fa-edit"></i>,
                access: myComment,
                action: () => setOpenmodal(true),
              },
              {
                id: "delete",
                name: "Delete Comment",
                icon: <i className="fas fa-trash-alt"></i>,
                access:
                  myPost_myComment ||
                  myPost_otherComment ||
                  otherPost_myComment,
                action: (data) => deleteComment(data),
              },
            ],
            comment,
            currentUser,
            setSelectedComment,
          }}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner />
      </div>
    );
  } else {
    if (comments.length > 0) {
      return (
        <div className="comments-box">
          {comments.map((comment) => {
            return (
              <div key={comment.commentID} className="comment">
                <div className="sender-pic">
                  <CircleProfileImage
                    data={{ email: comment.sender, size: 32 }}
                  />
                </div>
                <div className="body-content">
                  <div className="name">
                    {comment.senderName
                      ? comment.senderName
                      : SetNameFromEmail(comment.sender)}
                  </div>
                  <TimeFormat data={comment} />
                  <div className="text">{comment.comment}</div>
                  <HandleDropdownCase comment={comment} />
                </div>
              </div>
            );
          })}
          <EditComment data={{ ...modalContent, selectedComment }} />
        </div>
      );
    } else {
      return (
        <div className="comments-box">
          <div className="empty-comment">No comment yet.</div>
        </div>
      );
    }
  }
};

export default ShowComment;
