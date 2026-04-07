// ─── Common Reusable Components ───────────────────────────────────────────────

import React from "react";

export const Button = ({ children, variant = "primary", size = "md", onClick, disabled = false, icon, className = "", type = "button" }) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary: "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 focus:ring-blue-400 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm",
    outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400 shadow-sm",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = "default" }) => {
  const map = { published: "bg-emerald-100 text-emerald-700", draft: "bg-amber-100 text-amber-700", closed: "bg-slate-200 text-slate-500", active: "bg-blue-100 text-blue-700", inactive: "bg-slate-100 text-slate-500", suspended: "bg-red-100 text-red-600", Admin: "bg-purple-100 text-purple-700", Editor: "bg-blue-100 text-blue-700", Viewer: "bg-slate-100 text-slate-600", default: "bg-slate-100 text-slate-700" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[children] || map[variant]}`}>{children}</span>;
};

export const Card = ({ children, className = "", hover = false, onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""} ${className}`}>{children}</div>
);

export const Input = ({ label, type = "text", placeholder, value, onChange, error, icon, required = false, helperText }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-4 py-2.5 ${icon ? "pl-10" : ""} text-sm text-slate-800 bg-slate-50 border rounded-xl transition-all duration-150 outline-none ${error ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`} />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
    {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
        {actions && <div className="flex items-center justify-end gap-3 px-6 pb-6">{actions}</div>}
      </div>
    </div>
  );
};

export const Toast = ({ message, type = "success", onClose }) => {
  const types = { success: "bg-emerald-50 border-emerald-200 text-emerald-800", error: "bg-red-50 border-red-200 text-red-800", info: "bg-blue-50 border-blue-200 text-blue-800", warning: "bg-amber-50 border-amber-200 text-amber-800" };
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 border rounded-2xl shadow-lg text-sm font-medium ${types[type]}`}>
      <span className="text-base font-bold">{icons[type]}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
};

export const Avatar = ({ initials, size = "md", color = "blue" }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const colors = { blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700", green: "bg-emerald-100 text-emerald-700" };
  return <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>{initials}</div>;
};

export const StatCard = ({ label, value, icon, change, positive }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        {change && <p className={`text-xs font-medium mt-1 ${positive ? "text-emerald-600" : "text-red-500"}`}>{positive ? "↑" : "↓"} {change} vs last month</p>}
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </Card>
);

export const ProgressBar = ({ current, total, label }) => {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>{label}</span><span>{current}/{total}</span></div>}
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const Divider = ({ label }) => label ? (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
) : <div className="h-px bg-slate-100 my-4" />;

export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-blue-500" : "bg-slate-200"}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
    </div>
    {label && <span className="text-sm text-slate-600 font-medium">{label}</span>}
  </label>
);

export const SearchInput = ({ placeholder = "Search...", value, onChange }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
    <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
  </div>
);

export const Dropdown = ({ options, value, onChange, placeholder = "Select..." }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer">
    {placeholder && <option value="" disabled>{placeholder}</option>}
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);
