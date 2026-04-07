import { Avatar } from "../common";

// ============================================================
// SIDEBAR
// ============================================================
export const Sidebar = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "builder", icon: "✎", label: "Survey Builder" },
    { id: "response", icon: "◎", label: "Response Form" },
    { id: "analytics", icon: "⬡", label: "Analytics" },
    { id: "admin", icon: "⚙", label: "Admin Panel" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-100 flex flex-col z-30 shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">◈</span>
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">OSS</span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              activePage === item.id
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span
              className={`text-base w-5 text-center ${
                activePage === item.id ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
            {activePage === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <Avatar initials="AJ" size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Alex Johnson</p>
            <p className="text-xs text-slate-400 truncate">Admin</p>
          </div>
          <span className="text-slate-300 text-xs">↑↓</span>
        </div>
      </div>
    </aside>
  );
};

// ============================================================
// NAVBAR
// ============================================================
export const Navbar = ({ title, onNavigate }) => {
  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white/80 backdrop-blur border-b border-slate-100 z-20 flex items-center px-6 gap-4">
      <div className="flex-1">
        <h1 className="text-base font-bold text-slate-800">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all">
        <span className="text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search surveys..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Notif */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors">
        <span className="text-slate-500 text-sm">🔔</span>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
      </button>

      {/* Avatar */}
      <button
        onClick={() => onNavigate && onNavigate("admin")}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Avatar initials="AJ" size="sm" />
      </button>
    </header>
  );
};

// ============================================================
// PAGE WRAPPER
// ============================================================
export const PageWrapper = ({ children }) => (
  <main className="ml-60 pt-16 min-h-screen bg-slate-50">
    <div className="p-6 max-w-7xl mx-auto">{children}</div>
  </main>
);
