import React, { useState, useEffect } from "react";
import CircleProfileImage from "components/CircleProfileImage";
import { SetNameFromEmail } from "utils/helpers";
import { Link } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import DropdownSelect from "components/Dropdown";
import ConfirmModal from "components/Modal/ConfirmModal";
import ModalEditPost from "components/Modal/ModalEditPost";
import "./style.scss";

const PostHeader = ({ dataHeader }) => {
  const { post, user, currentUser } = dataHeader;
  const { deletePost } = useUserContext();
  const [mounted, setMounted] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleRemovePost = () => {
    deletePost({ user, post }).then((result) => {
      if (result && mounted) {
        setOpenConfirm(false);
      }
    });
  };

  const handleUpdatePost = () => {
    setOpenEdit(true);
  };

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

  const contentConfirm = {
    openmodal: openConfirm,
    btnConfirm: "Yes, Remove!",
    confirm: "Remove this post?",
    setOpenmodal: setOpenConfirm,
    actionSubmit: handleRemovePost,
  };

  const contentEdit = {
    openEdit,
    post,
    btnSubmit: "Update",
    title: "Edit Post",
    setOpenEdit,
  };

  const dropdownData = {
    items: [
      {
        name: "Edit Post",
        icon: <i className="fas fa-edit"></i>,
        access: true,
        action: () => handleUpdatePost(),
      },
      {
        name: "Remove Post",
        icon: <i className="fas fa-trash-alt"></i>,
        access: true,
        action: () => setOpenConfirm(true),
      },
    ],
  };

  return (
    <div className="post-header">
      <CircleProfileImage data={{ email: user.email, size: 48 }} />
      <div className="desc-zone">
        <Link to={`/profile/${user.userID.slice(0, 5)}`}>
          <div className="username">
            {user.userData.username
              ? user.userData.username
              : SetNameFromEmail(user.email)}
          </div>
        </Link>
        <div className="time">
          <TimeFormat data={post} />
        </div>
      </div>

      {currentUser.email === post.email && (
        <DropdownSelect data={{ ...dropdownData, post, currentUser }} />
      )}

      {openConfirm && <ConfirmModal data={{ ...contentConfirm }} />}
      {openEdit && <ModalEditPost content={{ ...contentEdit }} />}
    </div>
  );
};

export default PostHeader;
