import React from 'react';
import Counter from './components/Counter';
import LiveTextPreview from './components/LiveTextPreview';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>State Management</h1>
      <Counter />
      <LiveTextPreview />
    </div>
  );
}

export default App;
