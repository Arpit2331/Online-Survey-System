import React, { useState } from "react";
import { SearchInput, Avatar, Badge } from "../common";
import { currentUser } from "../../data/mockData";

export const Navbar = ({ title, onMenuToggle }) => {
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { id: 1, text: "Customer Satisfaction Survey got 12 new responses", time: "2m ago", unread: true },
    { id: 2, text: "Employee Engagement survey was published", time: "1h ago", unread: true },
    { id: 3, text: "Your export is ready to download", time: "3h ago", unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-20">
      <button onClick={onMenuToggle} className="text-slate-400 hover:text-slate-600 text-xl md:hidden">☰</button>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>
      <div className="hidden md:block w-64">
        <SearchInput placeholder="Search surveys..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
        {showNotif && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-sm">Notifications</span>
              <Badge variant="active">2 new</Badge>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${n.unread ? "bg-blue-50/40" : ""}`}>
                  <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 text-center">
              <button className="text-xs text-blue-600 font-medium hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>
      {/* Profile */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-xl px-2 py-1 transition-colors">
        <Avatar initials={currentUser.avatar} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-700">{currentUser.name}</p>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
        </div>
      </div>
    </header>
  );
};
