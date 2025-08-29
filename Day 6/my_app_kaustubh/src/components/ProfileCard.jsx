import React from 'react';
import './ProfileCard.css';
import profileImage from '../assets/profile.jpg'; // adjust path as needed

function ProfileCard() {
  return (
    <div className="profile-card">
      <img src={profileImage} alt="Profile" />
      <h2>Garvit Verma</h2>
      <p>Web Developer</p>
    </div>
  );
}

export default ProfileCard;
