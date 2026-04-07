import { useState } from "react";
import { Button, Card, Input, Toast, Badge } from "../components/common";
import { Sidebar, Navbar, PageWrapper } from "../components/layout";
import { surveyQuestions, questionTypes } from "../data/dummyData";

const QuestionCard = ({ q, index, isSelected, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className={`group relative bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
      isSelected ? "border-blue-500 shadow-md shadow-blue-100" : "border-transparent hover:border-slate-200"
    }`}
  >
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="w-1 h-1 bg-slate-300 rounded-full" />
      <span className="w-1 h-1 bg-slate-300 rounded-full" />
      <span className="w-1 h-1 bg-slate-300 rounded-full" />
    </div>

    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 w-6 h-6 rounded-lg flex items-center justify-center">
          {index + 1}
        </span>
        <span className="text-xs text-slate-400 capitalize">{q.type.replace("_", " ")}</span>
        {q.required && <Badge variant="active">Required</Badge>}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(q.id); }}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all text-xs"
      >
        ✕
      </button>
    </div>

    <p className="text-sm font-semibold text-slate-800 mb-3">{q.question}</p>

    {q.type === "multiple_choice" && (
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
            <span className="text-sm text-slate-600">{opt}</span>
          </div>
        ))}
      </div>
    )}

    {q.type === "text" && (
      <div className="h-8 bg-slate-50 rounded-lg border border-slate-200 px-3 flex items-center">
        <span className="text-xs text-slate-400">{q.placeholder}</span>
      </div>
    )}

    {q.type === "rating" && (
      <div className="flex gap-2">
        {Array.from({ length: q.maxRating }).map((_, i) => (
          <div
            key={i}
            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-medium ${
              i < 3 ? "border-blue-400 text-blue-600 bg-blue-50" : "border-slate-200 text-slate-400"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    )}
  </div>
);

const RightPanel = ({ selectedQuestion, questions, setQuestions }) => {
  const q = questions.find((q) => q.id === selectedQuestion);
  if (!q) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
          ←
        </div>
        <p className="text-slate-500 text-sm font-medium">Select a question to edit settings</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <h3 className="font-semibold text-slate-800">Question Settings</h3>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Question Text</label>
        <textarea
          value={q.question}
          onChange={(e) =>
            setQuestions(questions.map((item) => item.id === q.id ? { ...item, question: e.target.value } : item))
          }
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</label>
        <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Multiple Choice</option>
          <option>Short Text</option>
          <option>Rating Scale</option>
          <option>Dropdown</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Required</p>
          <p className="text-xs text-slate-400">Respondents must answer</p>
        </div>
        <button
          onClick={() =>
            setQuestions(questions.map((item) => item.id === q.id ? { ...item, required: !item.required } : item))
          }
          className={`relative w-10 h-5 rounded-full transition-colors ${q.required ? "bg-blue-600" : "bg-slate-200"}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              q.required ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {q.type === "multiple_choice" && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Options</label>
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt}
                onChange={(e) => {
                  const opts = [...q.options];
                  opts[i] = e.target.value;
                  setQuestions(questions.map((item) => item.id === q.id ? { ...item, options: opts } : item));
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const opts = q.options.filter((_, idx) => idx !== i);
                  setQuestions(questions.map((item) => item.id === q.id ? { ...item, options: opts } : item));
                }}
                className="text-slate-400 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setQuestions(questions.map((item) => item.id === q.id ? { ...item, options: [...item.options, `Option ${item.options.length + 1}`] } : item))
            }
          >
            + Add option
          </Button>
        </div>
      )}
    </div>
  );
};

export default function SurveyBuilder({ onNavigate }) {
  const [questions, setQuestions] = useState(surveyQuestions);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState("Customer Satisfaction Q2 2025");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addQuestion = (type) => {
    const newQ = {
      id: Date.now(),
      type,
      question: "Untitled question",
      required: false,
      options: type === "multiple_choice" ? ["Option 1", "Option 2"] : undefined,
      placeholder: type === "text" ? "Type your answer here..." : undefined,
      maxRating: type === "rating" ? 5 : undefined,
    };
    setQuestions([...questions, newQ]);
    setSelected(newQ.id);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selected === id) setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activePage="builder" onNavigate={onNavigate} />

      {/* Top bar */}
      <div className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-100 z-20 flex items-center px-6 gap-4">
        <div className="flex-1 flex items-center gap-3">
          <input
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            className="text-base font-bold text-slate-800 bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition-colors"
          />
          <Badge variant="draft">Draft</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => showToast("Preview opened", "info")}>
            Preview
          </Button>
          <Button variant="secondary" size="sm" onClick={() => showToast("Survey saved!", "success")}>
            Save
          </Button>
          <Button size="sm" onClick={() => showToast("Survey published! 🎉", "success")}>
            Publish
          </Button>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="ml-60 pt-16 flex h-[calc(100vh-0px)] overflow-hidden">
        {/* Left: Question Types */}
        <div className="w-56 bg-white border-r border-slate-100 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Question Types</p>
            <div className="space-y-1">
              {questionTypes.map((qt) => (
                <button
                  key={qt.type}
                  onClick={() => addQuestion(qt.type)}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group"
                >
                  <span className="text-sm mt-0.5">{qt.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                      {qt.label}
                    </p>
                    <p className="text-xs text-slate-400 leading-tight mt-0.5">{qt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Survey header card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
              <p className="text-xs font-medium opacity-70 mb-1">Survey Title</p>
              <h2 className="text-xl font-bold">{surveyTitle}</h2>
              <p className="text-sm opacity-70 mt-2">{questions.length} questions · Required fields marked *</p>
            </div>

            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                isSelected={selected === q.id}
                onClick={() => setSelected(q.id)}
                onDelete={deleteQuestion}
              />
            ))}

            <button
              onClick={() => addQuestion("multiple_choice")}
              className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
            >
              <span className="text-lg">+</span>
              Add question
            </button>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="w-64 bg-white border-l border-slate-100 overflow-y-auto flex-shrink-0">
          <RightPanel
            selectedQuestion={selected}
            questions={questions}
            setQuestions={setQuestions}
          />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
