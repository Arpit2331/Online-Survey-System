import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Ensure these files exist in src/pages/
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TakeSurvey from './pages/TakeSurvey';
import ResultsPage from './pages/ResultsPage';

const Dashboard = ({ user, onLogout }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeSurveyId, setActiveSurveyId] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState('text');
  const [optInput, setOptInput] = useState('');
  const [options, setOptions] = useState([]);

  // The Fix for the 500 Error
  const handleCreateSurvey = async () => {
    if (!title.trim()) return alert("Please enter a title");
    try {
      const res = await axios.post('https://online-survey-system-backend.onrender.com/api/surveys', {
        title,
        description: desc,
        creator_email: user?.email || 'test@example.com',
        questions: [] 
      });

      if (res.data.success) {
        setActiveSurveyId(res.data.surveyId);
        alert("Survey initialized! You can now add questions below.");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.error || "Check Render Logs"));
    }
  };

  const addQuestion = async () => {
    if (!activeSurveyId) return alert("Initialize the survey first!");
    try {
      await axios.post(`https://online-survey-system-backend.onrender.com/api/surveys/${activeSurveyId}/questions`, {
        question_text: questionText,
        question_type: type,
        options: options
      });
      alert("Question added!");
      setQuestionText('');
      setOptions([]);
    } catch (err) {
      alert("Failed to add question");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Start New Campaign</h2>
      <input type="text" placeholder="Survey Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      <button onClick={handleCreateSurvey} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px' }}>
        Initialize Survey
      </button>

      {activeSurveyId && (
        <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <h3>Add Question</h3>
          <input type="text" placeholder="Question Text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginBottom: '10px' }}>
            <option value="text">Text Answer</option>
            <option value="multiple">Multiple Choice</option>
          </select>
          <button onClick={addQuestion} style={{ display: 'block', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none' }}>Add to Survey</button>
        </div>
      )}
      <button onClick={onLogout} style={{ marginTop: '50px', color: 'red' }}>Logout</button>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/survey/:id" element={<TakeSurvey />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
