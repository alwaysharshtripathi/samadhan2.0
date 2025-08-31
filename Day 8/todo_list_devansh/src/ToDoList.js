import React, { useState, useEffect } from 'react';
import './ToDoList.css';

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask('');
  };

  const handleDelete = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleToggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div>
      <div className="input-group">
        <input
          type="text"
          placeholder=" Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button className="add-btn" onClick={handleAddTask}>
         Add
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={task.completed ? 'completed' : ''}
            onClick={() => handleToggleComplete(index)}
          >
            <span>{task.text}</span>
            <button className="delete-btn" onClick={(e) => {
              e.stopPropagation();
              handleDelete(index);
            }}>
             Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
