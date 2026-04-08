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
  const [mySurveys, setMySurveys] = useState([]);

  const fetchSurveys = async () => {
    try {
      const res = await axios.get(`https://online-survey-system-backend.onrender.com/api/surveys/${user.email}`);
      setMySurveys(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSurveys(); }, [user.email, activeSurveyId]);

  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    const res = await axios.post('https://online-survey-system-backend.onrender.com/api/surveys', { title, description: desc, creator_email: user.email });
    setActiveSurveyId(res.data.id);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    await axios.post('https://online-survey-system-backend.onrender.com/api/questions', {
      survey_id: activeSurveyId, question_text: questionText, question_type: type, options
    });
    setQuestionText(''); setOptions([]); setType('text');
    alert("Question Added!");
  };

  const styles = {
    card: { background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', boxSizing: 'border-box' },
    btnIndigo: { background: '#4f46e5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }
  };

  return (
    <div style={{ padding: '40px 5%', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}><span style={{color:'#4f46e5'}}>◈</span> SurveyFlow</h1>
        <button onClick={onLogout} style={{ border: 'none', background: '#fef2f2', color: '#dc2626', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </nav>

      <section style={styles.card}>
        {!activeSurveyId ? (
          <form onSubmit={handleCreateSurvey}>
            <h2 style={{marginTop:0}}>Start New Campaign</h2>
            <input placeholder="Campaign Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
            <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{...styles.input, height: '80px'}} />
            <button type="submit" style={styles.btnIndigo}>Initialize Survey</button>
          </form>
        ) : (
          <form onSubmit={handleAddQuestion}>
            <h2 style={{marginTop:0}}>Define Questions for {title}</h2>
            <input placeholder="Question Text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} style={styles.input} required />
            
            <label style={{fontSize: '14px', fontWeight: '600'}}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
              <option value="text">Text Input</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="yes_no">Yes / No</option>
            </select>

            {type === 'multiple_choice' && (
              <div style={{background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                  <input placeholder="Add Option" value={optInput} onChange={(e) => setOptInput(e.target.value)} style={{...styles.input, marginBottom: 0}} />
                  <button type="button" onClick={() => { if(optInput) setOptions([...options, optInput]); setOptInput(''); }} style={styles.btnIndigo}>Add</button>
                </div>
                <div style={{marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                  {options.map((o, i) => <span key={i} style={{background: '#e2e8f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px'}}>{o}</span>)}
                </div>
              </div>
            )}

            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" style={{...styles.btnIndigo, background: '#059669'}}>Save Question</button>
              <button type="button" onClick={() => setActiveSurveyId(null)} style={{...styles.btnIndigo, background: '#64748b'}}>Finish Setup</button>
            </div>
          </form>
        )}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {mySurveys.map(s => (
          <div key={s.id} style={styles.card}>
            <span style={{fontSize: '12px', fontWeight: 'bold', color: '#4f46e5'}}>{s.response_count} Responses</span>
            <h4 style={{margin: '10px 0'}}>{s.title}</h4>
            <div style={{display: 'flex', gap: '10px'}}>
              <Link to={`/results/${s.id}`} style={{...styles.btnIndigo, flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '14px', padding: '10px'}}>Analytics</Link>
              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/survey/${s.id}`); alert("Copied!"); }} style={{...styles.btnIndigo, background: '#f1f5f9', color: '#475569', flex: 1}}>Share</button>
              <button onClick={() => { if(window.confirm("Delete?")) axios.delete(`https://online-survey-system-backend.onrender.com/api/surveys/${s.id}`).then(fetchSurveys); }} style={{border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer'}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" />} />
        <Route path="/survey/:id" element={<TakeSurvey />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App; 
