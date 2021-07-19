import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import { Modal } from "react-responsive-modal";
import { Spinner } from "reactstrap";

const EditComment = ({ data }) => {
  const { selectedComment, openmodal, setOpenmodal, btnConfirm } = data;
  const { updateComments } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [mounted, setmounted] = useState(false);
  const [inputComment, setInputComment] = useState("");

  useEffect(() => {
    setmounted(true);
    if (selectedComment && mounted) {
      setInputComment(selectedComment.comment);
    }
    return () => {
      setmounted(false);
    };
  }, [data, mounted, selectedComment]);

  const onCloseModal = () => setOpenmodal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    selectedComment.comment = inputComment;
    updateComments(selectedComment).then((result) => {
      if (result.status) {
        onCloseModal();
        setLoading(false);
      }
    });
  };

  return (
    <Modal open={openmodal} onClose={onCloseModal} center>
      <div className="confirm-area">
        <h4>Edit Comment</h4>
        <form onSubmit={handleSubmit}>
          <input
            disabled={loading}
            className="input-comment"
            type="text"
            onChange={(e) => setInputComment(e.target.value)}
            value={inputComment}
          />
          <div className="button-area">
            <button
              disabled={loading}
              type="button"
              onClick={onCloseModal}
              className="cancel"
            >
              Cancel
            </button>
            <button disabled={loading} className="confirm">
              {loading ? <Spinner /> : btnConfirm}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditComment;
