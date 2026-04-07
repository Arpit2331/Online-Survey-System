import React, { useState } from "react";
import { Button, Card, Badge, StatCard, Modal, Input, Toast, SearchInput, Dropdown } from "../components/common";
import { surveys, stats } from "../data/mockData";

export const DashboardPage = ({ setActivePage }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState(null);

  const filtered = surveys.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? s.status === filter : true)
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    showToast(`Survey "${newTitle}" created!`);
    setShowModal(false);
    setNewTitle("");
    setActivePage("builder");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Good morning, Alex 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your surveys today.</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon="+" size="lg">Create New Survey</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Surveys" value={stats.totalSurveys} icon="📋" change="2" positive={true} />
        <StatCard label="Total Responses" value={stats.totalResponses} icon="💬" change="87" positive={true} />
        <StatCard label="Active Surveys" value={stats.activeSurveys} icon="🟢" change="1" positive={true} />
        <StatCard label="Avg Response Rate" value={stats.avgResponseRate} icon="📈" change="3%" positive={true} />
      </div>

      {/* Surveys Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-bold text-slate-800">My Surveys</h3>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search surveys…" value={search} onChange={e => setSearch(e.target.value)} />
          <Dropdown
            value={filter}
            onChange={setFilter}
            placeholder="All Status"
            options={[
              { value: "", label: "All Status" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "closed", label: "Closed" },
            ]}
          />
        </div>
      </div>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(survey => (
          <Card key={survey.id} hover className="p-5" onClick={() => setActivePage("builder")}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-3">
                <h4 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{survey.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{survey.category}</p>
              </div>
              <Badge>{survey.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span>💬 {survey.responses} responses</span>
              <span>❓ {survey.questions} questions</span>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setActivePage("builder"); }}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setActivePage("analytics"); }}>Analytics</Button>
              <button
                onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(`https://oss.app/s/${survey.id}`); showToast("Link copied!"); }}
                className="ml-auto text-slate-400 hover:text-blue-600 text-sm transition-colors"
                title="Copy link"
              >
                🔗
              </button>
              <button
                onClick={e => { e.stopPropagation(); showToast("Survey deleted", "error"); }}
                className="text-slate-400 hover:text-red-500 text-sm transition-colors"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </Card>
        ))}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-slate-700 font-semibold">No surveys found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Survey"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create & Edit</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Survey Title" placeholder="e.g. Customer Satisfaction Q1" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            {["Customer Feedback", "HR", "Product", "Events", "Research", "Other"].map(cat => (
              <label key={cat} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 text-sm text-slate-700">
                <input type="radio" name="category" className="text-blue-600" defaultChecked={cat === "Customer Feedback"} /> {cat}
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
