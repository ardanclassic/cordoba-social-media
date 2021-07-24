import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import LoginIllustration from "assets/images/login.svg";
import "../auth-style.scss";
import "./style.scss";

const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginGoogle, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  /** cleanup from memory leaks */
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      mounted && setError("");
      mounted && setLoading(true);
      if (type === "google") {
        await loginGoogle();
      } else {
        await login(emailRef.current.value, passwordRef.current.value);
      }
    } catch (error) {
      mounted && setError(error.message);
    }
    mounted && setLoading(false);
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-container">
      <img
        className="login-image"
        src={LoginIllustration}
        alt="pic-illustration"
      />
      <div className="card">
        <div className="card-header">
          <h3>Sign In</h3>
        </div>

        <div className="card-body">
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
            <div className="input-group form-group form-password">
              <input
                required
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="password"
                id="userPassword"
              />
              <i
                className="fas fa-eye-slash"
                style={{ display: !showPassword ? "block" : "none" }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
              <i
                className="fas fa-eye"
                style={{ display: showPassword ? "block" : "none" }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="btn-area">
              <button
                disabled={loading}
                className="btn btn-submit"
                type="submit"
              >
                Sign In
              </button>
              <div className="divider">
                <span>or</span>
              </div>
              <button
                disabled={loading}
                className="btn btn-google"
                type="button"
                onClick={(e) => handleSubmit(e, "google")}
              >
                <i className="fab fa-google"></i>
                <span>Login with Google</span>
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer">
          <div className="d-flex justify-content-center links">
            Don't have an account?
            <Link className="signup" to="signup">
              Sign Up
            </Link>
          </div>
          <div className="forgot-password">
            <Link to="/reset-password">Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
