import React from "react";

function Profile({ profile }) {
  if (!profile) return null;
  return (
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
  );
}

export default Profile; 