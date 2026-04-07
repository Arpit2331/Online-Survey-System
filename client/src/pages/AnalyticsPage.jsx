import React, { useState } from "react";
import { Button, Card, StatCard, Badge, Toast } from "../components/common";
import { analyticsData, surveys } from "../data/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2.5 text-sm">
        <p className="font-semibold text-slate-700">{label || payload[0].name}</p>
        <p className="text-blue-600">{payload[0].value} {label ? "responses" : "%"}</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsPage = () => {
  const [selectedSurvey, setSelectedSurvey] = useState("1");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Insights across all your surveys</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSurvey}
            onChange={e => setSelectedSurvey(e.target.value)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {surveys.filter(s => s.status === "published").map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => showToast("Report exported as CSV!")}>📥 Export CSV</Button>
          <Button variant="secondary" onClick={() => showToast("PDF report generated!")}>📄 PDF</Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {analyticsData.summary.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} change={s.change} positive={s.positive} icon={["💬","✅","⏱","↩"][i]} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Response Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly responses — last 6 months</p>
            </div>
            <Badge variant="active">Monthly</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="responses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800">Satisfaction Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Q1: How satisfied are you?</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={analyticsData.pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {analyticsData.pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {analyticsData.pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Survey Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Survey Performance</h3>
          <Button variant="ghost" size="sm">View all →</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Survey", "Status", "Responses", "Completion", "Avg Time", "Last Activity"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {surveys.map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-6">
                    <p className="font-medium text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-400">{s.category}</p>
                  </td>
                  <td className="py-3 pr-6"><Badge>{s.status}</Badge></td>
                  <td className="py-3 pr-6 font-semibold text-slate-800">{s.responses}</td>
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 40 + 50)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{Math.floor(Math.random() * 40 + 50)}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-slate-500">3m 20s</td>
                  <td className="py-3 pr-6 text-slate-400 text-xs">{s.lastModified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
