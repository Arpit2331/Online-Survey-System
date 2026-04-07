import { useState } from "react";
import { Button, Card, Badge, StatCard, Modal, Input } from "../components/common";
import { Sidebar, Navbar, PageWrapper } from "../components/layout";
import { surveys, stats } from "../data/dummyData";

const SurveyCard = ({ survey, onEdit }) => (
  <Card hover className="p-5 group" onClick={onEdit}>
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
        style={{ backgroundColor: survey.color + "20", color: survey.color }}
      >
        ◎
      </div>
      <Badge variant={survey.status}>{survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}</Badge>
    </div>

    <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 group-hover:text-blue-700 transition-colors">
      {survey.title}
    </h3>
    <p className="text-xs text-slate-400 mb-4">Modified {survey.lastModified}</p>

    <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
      <span className="flex items-center gap-1">
        <span className="text-blue-500">●</span>
        {survey.responses} responses
      </span>
      <span className="flex items-center gap-1">
        <span className="text-slate-300">|</span>
        {survey.questions} questions
      </span>
    </div>
  </Card>
);

export default function Dashboard({ onNavigate }) {
  const [activePage] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? surveys : surveys.filter((s) => s.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <Navbar title="Dashboard" onNavigate={onNavigate} />

      <PageWrapper>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Surveys</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track all your surveys</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="lg"
            icon="+"
          >
            Create New Survey
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Surveys" value={stats.totalSurveys} icon="◎" color="blue" />
          <StatCard label="Total Responses" value={stats.totalResponses} icon="📊" color="emerald" />
          <StatCard label="Active Surveys" value={stats.activeNow} icon="⬡" color="violet" />
          <StatCard label="Avg Completion" value={`${stats.avgCompletionRate}%`} icon="✓" color="amber" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {["all", "published", "draft", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 text-xs ${filter === f ? "opacity-70" : "text-slate-400"}`}>
                ({f === "all" ? surveys.length : surveys.filter((s) => s.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Survey Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onEdit={() => onNavigate("builder")}
            />
          ))}

          {/* Create new card */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
              <span className="text-xl text-slate-400 group-hover:text-blue-600 transition-colors">+</span>
            </div>
            <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
              New Survey
            </span>
          </button>
        </div>
      </PageWrapper>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Survey"
      >
        <div className="space-y-4">
          <Input
            label="Survey title"
            placeholder="e.g. Customer Satisfaction 2025"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Template</label>
            <div className="grid grid-cols-2 gap-2">
              {["Blank", "Feedback", "Research", "Event"].map((t) => (
                <button
                  key={t}
                  className="p-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 justify-center"
              onClick={() => {
                setShowCreateModal(false);
                onNavigate("builder");
              }}
            >
              Create Survey
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
