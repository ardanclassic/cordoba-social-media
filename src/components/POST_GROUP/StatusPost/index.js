import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "contexts/UserContext";
import { SetNameFromEmail } from "utils/helpers";
import { Spinner } from "reactstrap";
import autosize from "autosize";
import "./style.scss";

const StatusPost = ({ userProfile }) => {
  const { postNewContent } = useUserContext();
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = () => {
      autosize(document.querySelector("textarea"));
    };
    return unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      setLoading(true);
      const data = {
        contentID: "content#" + Math.floor(Math.random() * Math.pow(10, 10)),
        content: content,
        email: userProfile.email,
        userID: userProfile.userID,
        username: userProfile.userData.username,
        image: photoFile,
        imageName: photoFile
          ? `post-${Math.floor(Math.random() * Math.pow(10, 10))}-${
              photoFile.name
            }`
          : null,
      };
      postNewContent(data).then((result) => {
        if (result.success) {
          setContent("");
          setPhoto(null);
          setPhotoFile(null);
          setLoading(false);
          document.querySelector("textarea").style.height = "50px";
        }
      });
    }
  };

  const showUsername = () => {
    const text = "what's on your mind, ";
    if (userProfile) {
      if (userProfile.userData.username) {
        return text + userProfile.userData.username + "?";
      }
      return text + SetNameFromEmail(userProfile.email) + "?";
    }
    return "";
  };

  const onChangePhoto = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const tmpPhoto = URL.createObjectURL(file);
      setPhoto(tmpPhoto);
      setPhotoFile(file);
      // console.log(file, tmpPhoto);
    }
  };

  const cancelImage = (e) => {
    e.stopPropagation();
    URL.revokeObjectURL(photoFile);
    setPhoto(null);
    setPhotoFile(null);
  };

  return (
    <div className="status-post">
      <form onSubmit={handleSubmit}>
        <textarea
          required
          disabled={loading}
          name="statuspost"
          className="input"
          placeholder={showUsername()}
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        {photo && (
          <div
            className="image-area"
            onClick={() => window.open(photo, "_blank")}
          >
            <div className="overlay">
              {!loading && (
                <i className="fas fa-times" onClick={(e) => cancelImage(e)}></i>
              )}
            </div>
            <img src={photo} alt="profile-pict" />
          </div>
        )}
        <div className="button-area">
          <div className="upload-btn-wrapper">
            <label htmlFor="file-upload" className="custom-file-upload">
              <i className="fas fa-image"></i>
            </label>
            <input
              disabled={loading}
              id="file-upload"
              type="file"
              onChange={(e) => onChangePhoto(e)}
            />
          </div>
          <button disabled={loading} type="submit">
            {loading ? <Spinner /> : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusPost;
