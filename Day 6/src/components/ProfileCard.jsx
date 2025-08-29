import React from 'react';
import './ProfileCard.css';
import profileImage from '../assets/profile.jpg'; // adjust path as needed

function ProfileCard() {
  return (
    <div className="profile-card">
      <img src={profileImage} alt="Profile" />
      <h2>Harsh Tripathi</h2>
      <h10>Frontend Developer</h10>
    </div>
  );
}

export default ProfileCard;
