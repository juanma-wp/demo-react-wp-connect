import React from "react";
import { useWordPressAuth } from "./hooks/useWordPressAuth";
import Profile from "./components/Profile";
import LoginButton from "./components/LoginButton";
import ErrorMessage from "./components/ErrorMessage";
import Loading from "./components/Loading";
import "./styles/App.css";

function App() {
  const { profile, error, loading, handleLogin } = useWordPressAuth();

  return (
    <div style={{ padding: 32 }}>
      <h1>WordPress.com Connect Demo</h1>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} />} 
      {!profile && !loading && <LoginButton onClick={handleLogin} />}
      {profile && <Profile profile={profile} />}
    </div>
  );
}

export default App;
