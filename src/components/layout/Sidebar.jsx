import React from "react";
import { Avatar } from "../common";
import { currentUser } from "../../data/mockData";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "surveys", label: "My Surveys", icon: "📋" },
  { id: "builder", label: "Survey Builder", icon: "✏️" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "admin", label: "Admin Panel", icon: "🛡️" },
];

export const Sidebar = ({ activePage, setActivePage, collapsed = false }) => {
  return (
    <aside className={`h-screen bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-60"} flex-shrink-0 fixed left-0 top-0 z-30`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-100 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">O</span>
        </div>
        {!collapsed && <span className="font-bold text-slate-800 text-lg tracking-tight">OSS</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left ${
              activePage === item.id
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? item.label : ""}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && item.label}
            {!collapsed && activePage === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom user */}
      <div className={`border-t border-slate-100 p-4 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <Avatar initials={currentUser.avatar} size="sm" />
        ) : (
          <div className="flex items-center gap-3">
            <Avatar initials={currentUser.avatar} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 text-sm">⚙️</button>
          </div>
        )}
      </div>
    </aside>
  );
};
