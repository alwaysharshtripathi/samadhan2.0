import React, { useState } from 'react';

function LiveTextPreview() {
  const [text, setText] = useState('');

  return (
    <div className="card">
      <h2>Live Text Preview</h2>
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '8px', width: '300px' }}
      />
      <p style={{ marginTop: '15px' }}>
        <strong>Preview:</strong> {text}
      </p>
    </div>
  );
}

export default LiveTextPreview;
