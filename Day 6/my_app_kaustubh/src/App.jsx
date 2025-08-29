import React from 'react';
import ProfileCard from "./components/ProfileCard";

function App() {
  return (
    <div>
      <h1>My Profile</h1>
      <ProfileCard
        name="Garvit Verma"
        title="Web Developer"
        image="https://via.placeholder.com/100"
        description="Building fast and accessible web experiences."
      />
    </div>
  );
}

export default App;
