import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { Spinner } from "reactstrap";

const ConfirmModal = ({ data }) => {
  const { openmodal, setOpenmodal, confirm, btnConfirm, actionSubmit } = data;
  const [loading, setLoading] = useState(false);
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
    if (data && mounted) {
      setLoading(false);
    }
    return () => {
      setmounted(false);
    };
  }, [data, mounted]);

  const onCloseModal = () => setOpenmodal(false);

  const handleSubmit = (e) => {
    setLoading(true);
    actionSubmit();
  };

  return (
    <Modal open={openmodal} onClose={onCloseModal} center>
      <div className="confirm-area">
        <div className="text">{confirm}</div>
        <div className="button-area">
          <button onClick={onCloseModal} className="cancel">
            Cancel
          </button>
          <button className="confirm" onClick={() => handleSubmit()}>
            {loading ? <Spinner /> : btnConfirm}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
