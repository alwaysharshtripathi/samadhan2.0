import React from "react";

export default function MessageBubble({ msg, isMe }) {
  const delivered = (msg.deliveredTo || []).length > 0;
  const read = (msg.readBy || []).length > 0;
  return (
    <div className={"flex " + (isMe ? "justify-end" : "justify-start")}>
      <div className={"max-w-[75%] rounded-2xl px-4 py-2 mb-2 " + (isMe ? "bg-telegram-accent/90 text-black" : "bg-white/10")}>
        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        <div className="text-[10px] opacity-70 mt-1 flex items-center gap-1 justify-end">
          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isMe && (
            <span>
              {read ? "✓✓" : delivered ? "✓" : "•"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
