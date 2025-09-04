import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import Profile from "../components/Profile.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Chat() {
  const { user, token, logout, socket } = useAuth();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const fetchUsers = async () => {
    const list = await api("/users", { token });
    setUsers(list);
  };
  const fetchChats = async () => {
    const list = await api("/chats", { token });
    setChats(list);
  };
  const fetchMessages = async (chatId) => {
    const list = await api(`/messages/${chatId}`, { token });
    setMessages(list);
  };

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const onStatus = ({ userId, isOnline, lastSeen }) => {
      setUsers((prev) =>
        prev.map((u) =>
          String(u._id) === String(userId) ? { ...u, isOnline, lastSeen } : u
        )
      );
      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          participants: c.participants.map((p) =>
            String(p._id) === String(userId) ? { ...p, isOnline, lastSeen } : p
          ),
        }))
      );
    };
    const onTyping = ({ chatId, from, isTyping }) => {
      if (
        active &&
        String(active._id) === String(chatId) &&
        String(from) !== String(user._id)
      ) {
        setTyping(!!isTyping);
      }
    };
    const onMessage = ({ action, message, chatId, messageIds, by }) => {
      if (action === "send" && message) {
        if (active && String(message.chat) === String(active._id)) {
          setMessages((prev) => [...prev, message]);
          // immediately send read receipt if I'm viewing
          socket.emit("message", {
            action: "read",
            chatId: active._id,
            messageIds: [message._id],
          });
        }
        setChats((prev) => {
          const idx = prev.findIndex(
            (c) => String(c._id) === String(message.chat)
          );
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], lastMessage: message };
            const [item] = updated.splice(idx, 1);
            return [item, ...updated];
          }
          return prev;
        });
      }
      if (
        action === "read" &&
        active &&
        String(chatId) === String(active._id)
      ) {
        setMessages((prev) =>
          prev.map((m) =>
            messageIds.includes(m._id)
              ? { ...m, readBy: [...new Set([...(m.readBy || []), by])] }
              : m
          )
        );
      }
    };
    socket.on("status", onStatus);
    socket.on("typing", onTyping);
    socket.on("message", onMessage);
    return () => {
      socket.off("status", onStatus);
      socket.off("typing", onTyping);
      socket.off("message", onMessage);
    };
  }, [socket, active, user]);

  const openChat = async (chat) => {
    setActive(chat);
    await fetchMessages(chat._id);
    const unreadIds = messages
      .filter(
        (m) =>
          String(m.to) === String(user._id) &&
          !(m.readBy || []).includes(user._id)
      )
      .map((m) => m._id);
    if (unreadIds.length && socket) {
      socket.emit("message", {
        action: "read",
        chatId: chat._id,
        messageIds: unreadIds,
      });
    }
  };

  const other = useMemo(() => {
    if (!active) return null;
    return active.participants.find((p) => String(p._id) !== String(user._id));
  }, [active, user]);

  const startChatWith = async (userId) => {
    const chat = await api(`/chats/with/${userId}`, { method: "POST", token });
    if (!chats.find((c) => String(c._id) === String(chat._id))) {
      setChats((prev) => [chat, ...prev]);
    }
    openChat(chat);
  };

  const send = async (text) => {
    if (!socket || !other) return;
    socket.emit("message", {
      action: "send",
      to: other._id,
      chatId: active?._id,
      content: text,
    });
  };
  const emitTyping = (isTyping) => {
    if (!socket || !other || !active) return;
    socket.emit("typing", { chatId: active._id, to: other._id, isTyping });
  };

  return (
    <div className="h-screen max-h-screen flex">
      <Sidebar
        chats={chats}
        activeChatId={active?._id}
        onSelectChat={openChat}
        onLogout={logout}
        me={user}
      />

      <main className="flex-1 flex flex-col">
        {!active ? (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Start messaging</h2>
              <p className="text-white/60 mb-4">
                Pick someone from the directory to begin a one‑to‑one chat.
              </p>
              <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
                {users
                  .filter((u) => String(u._id) !== String(user._id))
                  .map((u) => (
                    <button
                      key={u._id}
                      onClick={() => startChatWith(u._id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-700 grid place-items-center mb-2">
                        <span className="text-sm font-bold">
                          {u.name.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-white/60">
                        {u.isOnline ? "online" : "offline"}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <ChatWindow
            me={user}
            other={other}
            messages={messages}
            typing={typing}
            onSend={send}
            onTyping={emitTyping}
          />
        )}
      </main>

      <Profile user={user} />
    </div>
  );
}
