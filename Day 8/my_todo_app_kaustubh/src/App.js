import React from "react";
import TodoList from "./ToDoList";
import './ToDoList.css';

function App() {
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>To-Do List</h1>
      <TodoList />
    </div>
  );
}

export default App;
