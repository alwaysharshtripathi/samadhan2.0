import React from "react";

export default function Profile({ user }) {
  return (
    <div className="hidden lg:flex w-80 border-l border-white/10 p-4 flex-col gap-3">
      <div className="text-lg font-semibold">Profile</div>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-700 grid place-items-center text-xl font-bold">
          {user?.name?.slice(0,1)?.toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">{user?.name}</div>
          <div className="text-sm text-white/60">{user?.email}</div>
        </div>
      </div>
      <div className="text-sm text-white/60">This is your profile. (Extend as needed)</div>
    </div>
  );
}
