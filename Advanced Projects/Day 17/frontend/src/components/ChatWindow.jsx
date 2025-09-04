import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ me, other, messages, typing, onSend, onTyping }) {
  const bottomRef = useRef();
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-700 grid place-items-center">
            <span className="text-sm font-bold">{other?.name?.slice(0,1)?.toUpperCase()}</span>
          </div>
          {other?.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border border-telegram-sidebar"></span>}
        </div>
        <div>
          <div className="font-semibold">{other?.name}</div>
          <div className="text-xs text-white/60">{typing ? "typing..." : (other?.isOnline ? "online" : other?.lastSeen ? `last seen ${new Date(other.lastSeen).toLocaleString()}` : "offline")}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
        {messages.map(m => (
          <MessageBubble key={m._id} msg={m} isMe={String(m.from) === String(me._id)} />
        ))}
        {typing && <div className="text-xs text-white/60">typing…</div>}
        <div ref={bottomRef} />
      </div>

      <div>
        <MessageInput onSend={onSend} onTyping={onTyping} />
      </div>
    </div>
  );
}
