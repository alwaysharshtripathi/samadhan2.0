import React from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default App;
