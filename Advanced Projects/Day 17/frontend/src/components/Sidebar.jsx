import React from "react";

export default function Sidebar({ chats, activeChatId, onSelectChat, onLogout, me }) {
  return (
    <aside className="w-full md:w-80 bg-telegram-sidebar border-r border-white/10 h-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-telegram-accent to-blue-500 grid place-items-center">
            <span className="text-sm font-bold">{me?.name?.slice(0,1)?.toUpperCase()}</span>
          </div>
          <div>
            <div className="font-semibold">{me?.name}</div>
            <div className="text-xs text-white/60">{me?.email}</div>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10">
          Logout
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {chats?.length === 0 && (
          <div className="text-center text-white/50 p-6">No chats yet. Start one by clicking a user in the directory.</div>
        )}
        {chats?.map(c => {
          const other = c.participants.find(p => String(p._id) !== String(me._id));
          return (
            <button
              key={c._id}
              onClick={() => onSelectChat(c)}
              className={"w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 " + (activeChatId===c._id ? "bg-white/10" : "")}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-700 grid place-items-center">
                  <span className="text-sm font-bold">{other?.name?.slice(0,1)?.toUpperCase()}</span>
                </div>
                {other?.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border border-telegram-sidebar"></span>}
              </div>
              <div className="text-left">
                <div className="font-medium">{other?.name}</div>
                <div className="text-xs text-white/60">{other?.isOnline ? "online" : (other?.lastSeen ? ("last seen " + new Date(other.lastSeen).toLocaleString()) : "offline")}</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
