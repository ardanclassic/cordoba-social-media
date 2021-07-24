import React from "react";
import { Modal } from "react-responsive-modal";

const ImageModal = ({ data }) => {
  const { openmodal, setOpenmodal, image } = data;
  const onCloseModal = () => setOpenmodal(false);
  
  return (
    <Modal open={openmodal} onClose={onCloseModal} center className="imagemodal">
      <div className="image-modal">
        <img src={image} alt="" />
      </div>
    </Modal>
  );
};

export default ImageModal;
