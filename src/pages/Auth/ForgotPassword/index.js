import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ForgotIllustration from 'assets/images/forgot-password.svg'
import { useAuth } from "contexts/AuthContext";
import "../auth-style.scss";
import "./style.scss";

const ForgotPassword = () => {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /** cleanup from memory leaks */
  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("")
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your email for further instruction.")
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <img className="forgot-image" src={ForgotIllustration} alt="pic-illustration" />
      <div className="card">
        <div className="card-header">
          <h3>Forgot Password</h3>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-success" role="alert">{message}</div>}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group form-group">
              <input
                required
                ref={emailRef}
                type="email"
                className="form-control"
                placeholder="email"
                id="userEmail"
              />
            </div>
            <div className="btn-area">
              <button
                disabled={loading}
                className="btn btn-forgot"
                type="submit"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer">
          <div className="d-flex justify-content-center links">
            Back to <Link className="signin" to="login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
