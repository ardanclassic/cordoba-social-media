import React, { useState, useEffect } from "react";
import { useUserContext } from "contexts/UserContext";
import "./style.scss";

const CommentForm = ({ data }) => {
  const { getLoginUser, sendComment } = useUserContext();
  const { post, user } = data;
  const [loginUser, setLoginUser] = useState(null);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getLoginUser().then((result) => {
      if (mounted) {
        setLoginUser(result);
      }
    });
    return () => setMounted(false);
  }, [getLoginUser, mounted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && loginUser) {
      setMessage("");
      sendComment({ message, post, recipient: user, sender: loginUser });
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        type="text"
        className="input comment-input"
        placeholder="write a comment . . ."
        onChange={(e) => handleChange(e)}
        value={message}
      />
    </form>
  );
};

export default CommentForm;
