import { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Button, Card, StatCard, Badge, Toast } from "../components/common";
import { Sidebar, Navbar, PageWrapper } from "../components/layout";
import { analyticsData, surveys } from "../data/dummyData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-slate-700">{label || payload[0].name}</p>
        <p className="text-blue-600 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics({ onNavigate }) {
  const [activeSurvey, setActiveSurvey] = useState(surveys[0]);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast({ message: msg, type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activePage="analytics" onNavigate={onNavigate} />
      <Navbar title="Analytics" onNavigate={onNavigate} />

      <PageWrapper>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Analytics Overview</h2>
            <p className="text-sm text-slate-500 mt-0.5">Track performance across all surveys</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
            <Button
              variant="secondary"
              icon="⬇"
              onClick={() => showToast("Export started — check your downloads")}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsData.summaryCards.map((s, i) => {
            const colors = ["blue", "emerald", "violet", "amber"];
            return (
              <StatCard
                key={i}
                label={s.label}
                value={s.value}
                change={s.change}
                up={s.up}
                color={colors[i]}
              />
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800">Monthly Responses</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total responses over time</p>
              </div>
              <Badge variant="active">Last 6 months</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analyticsData.barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="responses" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-bold text-slate-800">Satisfaction Split</h3>
              <p className="text-xs text-slate-400 mt-0.5">Response sentiment breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={analyticsData.pieData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analyticsData.pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {analyticsData.pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Survey table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Survey Performance</h3>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Survey", "Status", "Responses", "Completion", "Questions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surveys.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                      activeSurvey.id === s.id ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => setActiveSurvey(s)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: s.color + "20", color: s.color }}
                        >
                          ◎
                        </div>
                        <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                          {s.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={s.status}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">{s.responses}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, (s.responses / 250) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {Math.min(100, Math.round((s.responses / 250) * 100))}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{s.questions}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </PageWrapper>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
