import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

const AUTH_URL = "https://public-api.wordpress.com/oauth2/authorize";
const TOKEN_URL = "https://public-api.wordpress.com/oauth2/token";
const PROFILE_URL = "https://public-api.wordpress.com/rest/v1/me/";

const CLIENT_ID = import.meta.env.VITE_WPCC_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_WPCC_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_WPCC_REDIRECT_URI;

function generateState() {
  return Math.random().toString(36).substring(2);
}

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Handle redirect from WordPress.com
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("wpcc_state");

    if (code && state && state === storedState) {
      setLoading(true);
      // Step 2: Exchange code for access token
      axios
        .post("http://localhost:4000/api/exchange-token", {
          code,
          redirect_uri: REDIRECT_URI,
        })
        .then((res) => {
          const { access_token } = res.data;
          // Step 3: Fetch user profile
          return axios.get(PROFILE_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
        })
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Authentication failed.");
          setLoading(false);
        });
    }
  }, []);

  // Step 0: Start OAuth flow
  const handleLogin = () => {
    const state = generateState();
    localStorage.setItem("wpcc_state", state);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state,
    });
    window.location = `${AUTH_URL}?${params.toString()}`;
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>WordPress.com Connect Demo</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!profile && !loading && (
        <button onClick={handleLogin}>
          <img
            src="https://s0.wp.com/i/wpcc-button.png"
            alt="Connect with WordPress.com"
            width={231}
          />
        </button>
      )}
      {profile && (
        <div>
          <h2>Welcome, {profile.display_name}!</h2>
          <img src={profile.avatar_URL} alt="avatar" />
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Profile:</strong>{" "}
            <a href={profile.profile_URL} target="_blank" rel="noreferrer">
              {profile.profile_URL}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
