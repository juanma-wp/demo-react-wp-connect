import { useEffect, useState } from "react";
import axios from "axios";

const AUTH_URL = "https://public-api.wordpress.com/oauth2/authorize";
const PROFILE_URL = "https://public-api.wordpress.com/rest/v1/me/";

const CLIENT_ID = import.meta.env.VITE_WPCC_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_WPCC_REDIRECT_URI;

function generateState() {
  return Math.random().toString(36).substring(2);
}

export function useWordPressAuth() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("wpcc_state");

    if (code && state && state === storedState) {
      setLoading(true);
      axios
        .post("http://localhost:4000/api/exchange-token", {
          code,
          redirect_uri: REDIRECT_URI,
        })
        .then((res) => {
          const { access_token } = res.data;
          return axios.get(PROFILE_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
        })
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Authentication failed.");
          setLoading(false);
        });
    }
  }, []);

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

  return { profile, error, loading, handleLogin };
} 