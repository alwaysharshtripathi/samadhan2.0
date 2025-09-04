import React, { useEffect, useRef, useState } from "react";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const emitTyping = (isTyping) => {
    onTyping?.(isTyping);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    emitTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
    emitTyping(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex items-center gap-2 border-t border-white/10">
      <input
        className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
        placeholder="Write a message"
        value={text}
        onChange={handleChange}
      />
      <button className="px-4 py-2 rounded-xl bg-telegram-accent text-black font-semibold">Send</button>
    </form>
  );
}
