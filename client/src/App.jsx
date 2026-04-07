import React, { useState } from "react";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { DashboardPage } from "./pages/DashboardPage";
import { SurveyBuilderPage } from "./pages/SurveyBuilderPage";
import { SurveyResponsePage } from "./pages/SurveyResponsePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AdminPage } from "./pages/AdminPage";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  surveys: "My Surveys",
  builder: "Survey Builder",
  response: "Take Survey",
  analytics: "Analytics",
  admin: "Admin Panel",
};

export default function App() {
  const [auth, setAuth] = useState("login"); // login | signup | app
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth screens (full page, no sidebar)
  if (auth === "login") {
    return <LoginPage onLogin={() => setAuth("app")} switchToSignup={() => setAuth("signup")} />;
  }
  if (auth === "signup") {
    return <SignupPage onSignup={() => setAuth("app")} switchToLogin={() => setAuth("login")} />;
  }
  if (auth === "response") {
    return <SurveyResponsePage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage setActivePage={setActivePage} />;
      case "surveys": return <DashboardPage setActivePage={setActivePage} />;
      case "builder": return <SurveyBuilderPage setActivePage={setActivePage} />;
      case "analytics": return <AnalyticsPage />;
      case "admin": return <AdminPage />;
      default: return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  const isBuilderPage = activePage === "builder";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-60"}`}>
        <Navbar
          title={PAGE_TITLES[activePage] || "Dashboard"}
          onMenuToggle={() => setSidebarCollapsed(p => !p)}
        />

        {/* Demo Nav Buttons */}
        <div className="bg-white border-b border-slate-100 px-6 py-2.5 flex items-center gap-2 overflow-x-auto flex-shrink-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-2">Quick Demo:</span>
          {[
            { page: "dashboard", label: "📊 Dashboard" },
            { page: "builder", label: "✏️ Builder" },
            { page: "analytics", label: "📈 Analytics" },
            { page: "admin", label: "🛡️ Admin" },
          ].map(({ page, label }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activePage === page ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setAuth("response")}
            className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 whitespace-nowrap transition-colors"
          >
            📝 Take Survey
          </button>
          <button
            onClick={() => setAuth("login")}
            className="px-3 py-1 ml-auto rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 whitespace-nowrap transition-colors"
          >
            ← Logout
          </button>
        </div>

        <main className={`flex-1 overflow-y-auto ${isBuilderPage ? "overflow-hidden" : ""}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
