import React, { useState } from "react";
import { Button, ProgressBar } from "../components/common";
import { sampleSurveyQuestions } from "../data/mockData";

const QuestionRenderer = ({ q, answer, onAnswer }) => {
  switch (q.type) {
    case "multiple_choice":
      return (
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <label key={i} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${answer === opt ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answer === opt ? "border-blue-500" : "border-slate-300"}`}>
                {answer === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
              </div>
              <span className="text-sm font-medium text-slate-700">{opt}</span>
              <input type="radio" name={`q${q.id}`} value={opt} checked={answer === opt} onChange={() => onAnswer(opt)} className="sr-only" />
            </label>
          ))}
        </div>
      );
    case "checkbox":
      const checked = Array.isArray(answer) ? answer : [];
      return (
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isChecked = checked.includes(opt);
            return (
              <label key={i} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isChecked ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                onClick={() => onAnswer(isChecked ? checked.filter(c => c !== opt) : [...checked, opt])}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                  {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-medium text-slate-700">{opt}</span>
              </label>
            );
          })}
        </div>
      );
    case "text":
      return (
        <input
          type="text"
          placeholder={q.placeholder}
          value={answer || ""}
          onChange={e => onAnswer(e.target.value)}
          className="w-full px-5 py-3.5 border-2 border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50/30 transition-all"
        />
      );
    case "rating":
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: q.max }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onAnswer(n)}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${answer === n ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700"}`}
            >
              {n}
            </button>
          ))}
        </div>
      );
    default:
      return <input type="text" className="w-full px-5 py-3.5 border-2 border-slate-200 rounded-2xl text-sm" />;
  }
};

export const SurveyResponsePage = () => {
  const questions = sampleSurveyQuestions;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const answer = answers[q?.id];

  const handleNext = () => {
    if (q.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      setError("This question is required.");
      return;
    }
    setError("");
    if (isLast) { setSubmitted(true); return; }
    setCurrent(c => c + 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Thank you!</h2>
          <p className="text-slate-500 text-sm mb-8">Your response has been recorded. We appreciate your time and feedback.</p>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your Responses</p>
            {questions.map(q => (
              <div key={q.id} className="mb-3 pb-3 border-b border-slate-100 last:border-0 last:mb-0">
                <p className="text-xs text-slate-500 mb-1">{q.question}</p>
                <p className="text-sm font-medium text-slate-800">
                  {Array.isArray(answers[q.id]) ? answers[q.id].join(", ") : answers[q.id] || <span className="text-slate-400 italic">Skipped</span>}
                </p>
              </div>
            ))}
          </div>
          <Button onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); }} variant="outline" size="lg">Submit another response</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <span className="font-bold text-slate-700 text-sm">Online Survey System</span>
        </div>
        <span className="text-xs text-slate-400">{current + 1} / {questions.length}</span>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-slate-100 px-6 pb-4 pt-2">
        <ProgressBar current={current + 1} total={questions.length} label="Progress" />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 md:p-10">
            {/* Question badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center flex-shrink-0">
                {current + 1}
              </span>
              {q.required && <span className="text-xs text-red-500 font-medium">Required</span>}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">{q.question}</h2>

            <QuestionRenderer q={q} answer={answer} onAnswer={v => { setAnswers(p => ({...p, [q.id]: v})); setError(""); }} />

            {error && <p className="mt-3 text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => { setCurrent(c => Math.max(0, c - 1)); setError(""); }}
                disabled={current === 0}
              >
                ← Back
              </Button>
              <Button onClick={handleNext} size="lg">
                {isLast ? "Submit Response ✓" : "Next →"}
              </Button>
            </div>
          </div>

          {/* Skip option */}
          {!q.required && (
            <div className="text-center mt-4">
              <button onClick={() => { setCurrent(c => Math.min(questions.length - 1, c + 1)); }} className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
                Skip this question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
