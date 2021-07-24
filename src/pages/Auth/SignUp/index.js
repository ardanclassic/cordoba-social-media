import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import SignUpIllustration from 'assets/images/signup.svg'
import { useAuth } from "contexts/AuthContext";
import "../auth-style.scss";
import "./style.scss";

const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signUp, loginGoogle, currentUser } = useAuth();
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
        await signUp(emailRef.current.value, passwordRef.current.value);
      }
    } catch (error) {
      mounted && setError(error.message);
    }
    mounted && setLoading(false);
  };

  if (currentUser) {
    return <Redirect to="/" />
  }

  return (
    <div className="auth-container">
      <img className="signup-image" src={SignUpIllustration} alt="pic-illustration" />
      <div className="card">
        <div className="card-header">
          <h3>Sign Up</h3>
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
                Sign Up
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
            Already have an account?
            <Link className="signin" to="login">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
