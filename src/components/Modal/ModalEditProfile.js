import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { Spinner } from "reactstrap";
import { useUserContext } from "contexts/UserContext";
import { storage } from "firebaseConfig";
import MaleAvatar from "assets/images/male-avatar.svg";
import FemaleAvatar from "assets/images/female-avatar.svg";
import "./style.scss";

const EditProfile = ({ content }) => {
  const { updateProfile } = useUserContext();
  const { openmodal, btnSubmit, title, user, setOpenmodal } = content;

  const [name, setname] = useState("");
  const [passion, setpassion] = useState("");
  const [gender, setgender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      if (mounted) {
        setPhoto(localStorage.getItem("photourl"));
        if (!localStorage.getItem("photourl")) {
          setPhoto(user.userData.photoProfile);
          if (!user.userData.photoProfile) {
            setPhoto(MaleAvatar);
            if (user.userData.gender === "female") setPhoto(FemaleAvatar);
          }
        }

        setname(user.userData.username);
        setpassion(user.userData.passion);
        setgender(user.userData.gender);
      }
    }

    return () => {
      setPhotoFile(null);
      setMounted(false);
    };
  }, [content, mounted, user]);

  const onCloseModal = () => !loading && setOpenmodal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      let data = {
        email: user.email,
        username: name,
        passion: passion,
        gender: gender,
        photoProfile: photo,
      };

      if (photoFile) {
        const fileRef = storage.child(
          `profile-pictures/${user.email}/${photoFile.name}`
        );
        fileRef.put(photoFile).then(async () => {
          const photoURL = await fileRef.getDownloadURL();
          data = { ...data, photoProfile: photoURL };
          updateProfile(data).then((result) => {
            if (result.status) {
              localStorage.removeItem("photourl");
              setOpenmodal(false);
              setLoading(false);
            }
          });
        });
      } else {
        updateProfile(data).then((result) => {
          if (result.status) {
            setOpenmodal(false);
            setLoading(false);
          }
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const onChangePhoto = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const tmpPhoto = URL.createObjectURL(file);
      localStorage.setItem("photourl", tmpPhoto);
      setPhoto(tmpPhoto);
      setPhotoFile(file);
      // console.log(file, tmpPhoto);
    }
  };

  return (
    <Modal open={openmodal} onClose={onCloseModal} center>
      <h4>{title}</h4>
      {error && <p className="text-danger">{error}</p>}
      <form disabled={loading} onSubmit={handleSubmit}>
        <div className="input-group form-group form-photo-profile">
          <span className="circle-image">
            <img src={photo} alt="profile-pict" />
          </span>
          <input
            disabled={loading}
            type="file"
            name="photo-profile"
            className="photo-profile"
            onChange={(e) => onChangePhoto(e)}
          ></input>
        </div>
        <div className="input-group form-group form-name">
          <input
            required
            value={name}
            onChange={(e) => setname(e.target.value)}
            type="text"
            className="form-control"
            placeholder="your name"
            id="username"
          />
        </div>
        <div className="input-group form-group form-occupation">
          <input
            required
            value={passion}
            onChange={(e) => setpassion(e.target.value)}
            type="text"
            className="form-control"
            placeholder="your passion / role / dream"
            id="useroccupation"
          />
        </div>
        <div className="input-group form-group form-gender">
          <select
            required
            value={gender}
            onChange={(e) => setgender(e.target.value)}
            className="form-select"
            id="usergender"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="btn-area">
          <button
            disabled={loading}
            className="button btn-cancel"
            type="button"
            onClick={onCloseModal}
          >
            Cancel
          </button>
          <button disabled={loading} type="submit" className={`btn-submit`}>
            {!loading ? btnSubmit : <Spinner color="light" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;
