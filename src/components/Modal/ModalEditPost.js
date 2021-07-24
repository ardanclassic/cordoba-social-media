import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { Spinner } from "reactstrap";
import { useUserContext } from "contexts/UserContext";
import TextareaAutosize from "react-textarea-autosize";
import "./style.scss";

const EditPost = ({ content }) => {
  const { updateContentPost } = useUserContext();
  const { openEdit, title, post, setOpenEdit } = content;

  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [imageRemove, setImageRemove] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (post) {
      if (mounted) {
        // console.log(post);
        setPhoto(post.image);
        setMessageContent(post.content);
      }
    }
    return () => {
      setMounted(false);
    };
  }, [content, mounted, post]);

  const onCloseModal = () => {
    if (!loading) {
      localStorage.removeItem("tmpPostImage");
      setOpenEdit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setError("");
      if (messageContent) {
        setLoading(true);
        const data = {
          contentID: post.contentID,
          created_at: post.created_at,
          email: post.email,
          userID: post.userID,
          username: post.username,
          content: messageContent,
          oldImage: !imageRemove ? post.image : null,
          oldImageName: !imageRemove ? post.imageName : null,
          image: photoFile,
          imageName: photoFile
            ? `post-${Math.floor(Math.random() * Math.pow(10, 10))}-${
                photoFile.name
              }`
            : null,
        };

        updateContentPost(data).then((result) => {
          if (result.success) {
            setMessageContent("");
            setPhoto(null);
            setPhotoFile(null);
            setLoading(false);
            onCloseModal();
          }
        });
      }
    } catch (error) {
      // setError(error.message);
    }
  };

  const onChangePhoto = (e) => {
    if (e.target.files.length > 0) {
      setImageRemove(false);
      const file = e.target.files[0];
      const tmpPhoto = URL.createObjectURL(file);
      localStorage.setItem("tmpPostImage", tmpPhoto);
      setPhoto(tmpPhoto);
      setPhotoFile(file);
      // console.log(file, tmpPhoto);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    URL.revokeObjectURL(photoFile);
    setImageRemove(true);
    setPhoto(null);
    setPhotoFile(null);
  };

  return (
    <Modal open={openEdit} onClose={onCloseModal} center>
      <h4>{title}</h4>

      <form onSubmit={handleSubmit} className="form-edit-post">
        <TextareaAutosize
          required
          disabled={loading}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          type="text"
          className="form-control input"
          placeholder="What's on your mind?"
        />
        {photo && (
          <div
            className="image-area"
            onClick={() => window.open(photo, "_blank")}
          >
            <div className="overlay">
              {!loading && (
                <i className="fas fa-times" onClick={(e) => removeImage(e)}></i>
              )}
            </div>
            <img src={photo} alt="profile-pict" />
          </div>
        )}
        <div className="button-area">
          <div className="upload-btn-wrapper">
            <label htmlFor="image-post" className="custom-file-upload">
              <i className="fas fa-image"></i>
            </label>
            <input
              disabled={loading}
              id="image-post"
              type="file"
              onChange={(e) => onChangePhoto(e)}
            />
          </div>
          <button disabled={loading} type="submit">
            {loading ? <Spinner /> : "Update"}
          </button>
        </div>
      </form>

    </Modal>
  );
};

export default EditPost;
