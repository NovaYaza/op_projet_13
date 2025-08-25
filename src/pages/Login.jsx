import "../assets/styles/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUserProfile } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      // Dès qu'on a le token → on va chercher le profil
      dispatch(fetchUserProfile()).then(() => {
        navigate("/profile");
      });
    }
  }, [token, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: username, password }));
  };

  return (
    <main className="main bg-dark login-main">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="sign-in-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Loading..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}