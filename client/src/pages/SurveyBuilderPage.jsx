import React, { useState } from "react";
import { Button, Card, Input, Toggle, Badge, Toast, Modal } from "../components/common";
import { sampleSurveyQuestions } from "../data/mockData";

const QUESTION_TYPES = [
  { id: "multiple_choice", label: "Multiple Choice", icon: "⊙", desc: "Single selection" },
  { id: "checkbox", label: "Checkboxes", icon: "☑", desc: "Multiple selection" },
  { id: "text", label: "Short Text", icon: "✏", desc: "Free-form answer" },
  { id: "long_text", label: "Long Text", icon: "📝", desc: "Paragraph answer" },
  { id: "rating", label: "Rating Scale", icon: "⭐", desc: "Numeric scale" },
  { id: "dropdown", label: "Dropdown", icon: "▾", desc: "Select from list" },
  { id: "date", label: "Date", icon: "📅", desc: "Date picker" },
  { id: "file", label: "File Upload", icon: "📎", desc: "Accept files" },
];

const QuestionCard = ({ q, index, selected, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className={`group bg-white border-2 rounded-2xl p-5 cursor-pointer transition-all duration-150 ${
      selected ? "border-blue-400 shadow-md shadow-blue-100" : "border-slate-100 hover:border-slate-200"
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1">
        <span className="mt-0.5 text-xs font-bold text-slate-400 w-5 flex-shrink-0">Q{index + 1}</span>
        <div className="flex-1">
          <p className="font-medium text-slate-800 text-sm">{q.question}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="active">{q.type.replace(/_/g, " ")}</Badge>
            {q.required && <Badge variant="draft">Required</Badge>}
          </div>
          {q.options && (
            <div className="mt-3 flex flex-col gap-1">
              {q.options.slice(0, 3).map((opt, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-3 h-3 rounded-full border border-slate-300" />
                  {opt}
                </div>
              ))}
              {q.options.length > 3 && <p className="text-xs text-slate-400 ml-5">+{q.options.length - 3} more</p>}
            </div>
          )}
          {q.type === "rating" && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: q.max }, (_, i) => (
                <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${i < 5 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{i + 1}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm" title="Duplicate">⧉</button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-sm" title="Delete">🗑</button>
      </div>
    </div>
  </div>
);

const SettingsPanel = ({ question, onUpdate }) => {
  if (!question) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <span className="text-4xl mb-3">👈</span>
      <p className="text-slate-600 font-medium text-sm">Select a question to edit its settings</p>
    </div>
  );

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Question Settings</p>
        <div className="flex flex-col gap-3">
          <Input label="Question Text" value={question.question} onChange={e => onUpdate({ question: e.target.value })} />
          {question.placeholder !== undefined && (
            <Input label="Placeholder" value={question.placeholder} onChange={e => onUpdate({ placeholder: e.target.value })} />
          )}
        </div>
      </div>

      {question.options && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Options</p>
          <div className="flex flex-col gap-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <input
                  value={opt}
                  onChange={e => { const opts = [...question.options]; opts[i] = e.target.value; onUpdate({ options: opts }); }}
                  className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
                <button onClick={() => onUpdate({ options: question.options.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-400 text-sm">✕</button>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ options: [...question.options, `Option ${question.options.length + 1}`] })}
              className="text-xs text-blue-600 font-medium hover:underline text-left mt-1"
            >
              + Add option
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
        <Toggle checked={question.required} onChange={v => onUpdate({ required: v })} label="Required question" />
        <Toggle checked={false} onChange={() => {}} label="Include description" />
        <Toggle checked={false} onChange={() => {}} label="Randomize options" />
      </div>
    </div>
  );
};

export const SurveyBuilderPage = ({ setActivePage }) => {
  const [questions, setQuestions] = useState(sampleSurveyQuestions);
  const [selectedId, setSelectedId] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState("Customer Satisfaction Survey");
  const [toast, setToast] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const showMsg = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addQuestion = (type) => {
    const typeDefaults = {
      multiple_choice: { options: ["Option 1", "Option 2", "Option 3"] },
      checkbox: { options: ["Option 1", "Option 2", "Option 3"] },
      text: { placeholder: "Type your answer here..." },
      long_text: { placeholder: "Write your response..." },
      rating: { min: 1, max: 10 },
      dropdown: { options: ["Option 1", "Option 2", "Option 3"] },
      date: {},
      file: {},
    };
    const newQ = {
      id: Date.now(),
      type,
      question: `New ${type.replace(/_/g, " ")} question`,
      required: false,
      ...typeDefaults[type],
    };
    setQuestions(prev => [...prev, newQ]);
    setSelectedId(newQ.id);
    showMsg("Question added!");
  };

  const selectedQ = questions.find(q => q.id === selectedId);
  const updateQuestion = (changes) => {
    setQuestions(prev => prev.map(q => q.id === selectedId ? { ...q, ...changes } : q));
  };
  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex h-full">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Left: Question Types */}
      <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Question Types</p>
        </div>
        <div className="p-3 flex flex-col gap-1">
          {QUESTION_TYPES.map(qt => (
            <button
              key={qt.id}
              onClick={() => addQuestion(qt.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-blue-50 hover:text-blue-700 transition-colors group w-full"
            >
              <span className="text-lg flex-shrink-0">{qt.icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{qt.label}</p>
                <p className="text-[10px] text-slate-400">{qt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4">
          <input
            value={surveyTitle}
            onChange={e => setSurveyTitle(e.target.value)}
            className="flex-1 font-bold text-slate-800 text-lg bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none transition-colors"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => showMsg("Draft saved!", "info")}>💾 Save</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowPreview(true)}>👁 Preview</Button>
            <Button size="sm" onClick={() => { showMsg("Survey published!"); setActivePage("surveys"); }}>🚀 Publish</Button>
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {/* Survey header */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 mb-2">
              <h2 className="text-xl font-bold text-slate-800">{surveyTitle}</h2>
              <p className="text-sm text-slate-500 mt-1">Drag questions to reorder • Click to edit settings</p>
            </div>

            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                selected={selectedId === q.id}
                onClick={() => setSelectedId(q.id)}
                onDelete={() => deleteQuestion(q.id)}
              />
            ))}

            {/* Add question */}
            <button
              onClick={() => addQuestion("text")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-sm text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span> Add a question
            </button>
          </div>
        </div>
      </div>

      {/* Right: Settings Panel */}
      <aside className="w-64 flex-shrink-0 bg-white border-l border-slate-100 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Settings</p>
        </div>
        <SettingsPanel question={selectedQ} onUpdate={updateQuestion} />
      </aside>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Survey Preview" actions={
        <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
      }>
        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-slate-500">This is how respondents will see your survey.</p>
          {questions.map((q, i) => (
            <div key={q.id} className="border border-slate-100 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-800 mb-2">Q{i + 1}. {q.question} {q.required && <span className="text-red-500">*</span>}</p>
              {q.options && q.options.map((opt, j) => (
                <label key={j} className="flex items-center gap-2 text-xs text-slate-600 py-1 cursor-pointer">
                  <input type={q.type === "checkbox" ? "checkbox" : "radio"} name={`q${q.id}`} /> {opt}
                </label>
              ))}
              {(q.type === "text" || q.type === "long_text") && (
                <input placeholder={q.placeholder} className="w-full mt-1 text-xs px-3 py-2 border border-slate-200 rounded-lg" />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
