import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const onAuth = (u) => {
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const onLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f4f8', 
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#1a202c',
        fontSize: '18px' // Global larger font
      }}>
        <Routes>
          <Route path="/login" element={!user ? <Login onAuth={onAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={onLogout} /> : <Navigate to="/login" />} />
          <Route path="/survey/:id" element={<PublicSurvey />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- DASHBOARD: MODERN & BOLD ---
function Dashboard({ user, onLogout }) {
  const [surveys, setSurveys] = useState([]);
  const [activeID, setActiveID] = useState(null);
  const [responses, setResponses] = useState([]);
  const [viewID, setViewID] = useState(null);
  const [qText, setQText] = useState('');

  const getHistory = () => {
    axios.get(`${API_BASE}/api/surveys?email=${user.email}`)
      .then(res => setSurveys(res.data.surveys))
      .catch(() => console.log("Connection error"));
  };

  useEffect(getHistory, [user.email]);

  const doCreate = async (e) => {
    e.preventDefault();
    const title = e.target.survey_t.value;
    const res = await axios.post(`${API_BASE}/api/surveys`, { title, creator_email: user.email });
    if (res.data.success) {
      setActiveID(res.data.surveyId);
      getHistory();
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: 'auto', padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#4c51bf', margin: 0 }}>SurveyPro</h1>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>Logged in as: {user.name}</p>
          <button onClick={onLogout} style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>Logout →</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* MAIN WORK AREA */}
        <div style={{ flex: 1.5, backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          {viewID ? (
            <div>
              <button onClick={() => setViewID(null)} style={{ marginBottom: '20px', cursor:'pointer' }}>← Back to Workspace</button>
              <h2 style={{ fontSize: '32px' }}>Analytics for Survey #{viewID}</h2>
              <hr style={{ opacity: 0.1, margin: '20px 0' }} />
              {responses.length === 0 ? <p style={{ fontSize: '20px', opacity: 0.5 }}>No data collected yet.</p> : (
                responses.map((r, i) => (
                  <div key={i} style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '12px', marginBottom: '15px', borderLeft: '6px solid #4c51bf' }}>
                    <small style={{ color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>Question Text</small>
                    <div style={{ fontSize: '22px', fontWeight: '600', marginTop: '5px' }}>{r.response_value}</div>
                  </div>
                ))
              )}
            </div>
          ) : activeID ? (
            <div>
              <h2 style={{ color: '#4c51bf', fontSize: '32px' }}>🛠 Build Your Questions</h2>
              <div style={{ background: '#ebf4ff', padding: '15px', borderRadius: '10px', color: '#2c5282', fontWeight: '600', marginBottom: '25px', fontSize: '16px' }}>
                Sharable Link: {window.location.origin}/survey/{activeID}
              </div>
              <input 
                placeholder="Type your question here..." 
                value={qText} 
                onChange={e => setQText(e.target.value)} 
                style={{ width: '100%', padding: '20px', fontSize: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px', boxSizing: 'border-box' }} 
              />
              <button onClick={async () => {
                await axios.post(`${API_BASE}/api/questions`, { survey_id: activeID, question_text: qText, question_type: 'text' });
                setQText('');
                alert("Question Saved to Database!");
              }} style={{ width: '100%', padding: '20px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                Add to Survey
              </button>
              <button onClick={() => setActiveID(null)} style={{ width: '100%', marginTop: '15px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '18px' }}>
                Finish and View All Surveys
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>Start a New Project</h2>
              <p style={{ color: '#718096', marginBottom: '30px' }}>Give your survey a title to get started.</p>
              <form onSubmit={doCreate}>
                <input 
                  name="survey_t" 
                  placeholder="e.g., Customer Feedback 2026" 
                  required 
                  style={{ width: '100%', padding: '20px', fontSize: '22px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px', boxSizing: 'border-box' }} 
                />
                <button type="submit" style={{ width: '100%', padding: '25px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '12px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Initialize Dashboard
                </button>
              </form>
            </div>
          )}
        </div>

        {/* HISTORY SIDEBAR */}
        <div style={{ flex: 0.8, backgroundColor: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #f7fafc', paddingBottom: '10px' }}>📜 Your Projects</h3>
          {surveys.length === 0 ? <p style={{ opacity: 0.5 }}>No surveys yet.</p> : surveys.map(s => (
            <div key={s.survey_id} style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>{s.title}</div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={async () => {
                  const res = await axios.get(`${API_BASE}/api/surveys/${s.survey_id}/responses`);
                  setResponses(res.data.responses);
                  setViewID(s.survey_id);
                }} style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #4c51bf', color: '#4c51bf', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  Results
                </button>
                <Link to={`/survey/${s.survey_id}`} style={{ textDecoration: 'none', color: '#718096', fontSize: '16px', alignSelf: 'center' }}>Public Link →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- PUBLIC SURVEY VIEW ---
function PublicSurvey() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [ans, setAns] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE}/api/public/surveys/${id}`).then(res => setData(res.data));
  }, [id]);

  if (!data) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '30px' }}>Loading Survey Content...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>{data.survey.title}</h1>
        <p style={{ fontSize: '20px', opacity: 0.6, marginBottom: '40px' }}>Please answer the questions below.</p>
        <hr style={{ opacity: 0.1, marginBottom: '40px' }} />
        {data.questions.map(q => (
          <div key={q.question_id} style={{ marginBottom: '35px' }}>
            <label style={{ display: 'block', fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>{q.question_text}</label>
            <input 
              placeholder="Your answer..."
              onChange={e => setAns({ ...ans, [q.question_id]: e.target.value })} 
              style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', boxSizing: 'border-box' }} 
            />
          </div>
        ))}
        <button onClick={async () => {
          const formatted = Object.keys(ans).map(k => ({ question_id: k, val: ans[k] }));
          await axios.post(`${API_BASE}/api/public/responses`, { survey_id: id, answers: formatted });
          alert("Submission Successful! Thank you.");
        }} style={{ width: '100%', padding: '25px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '15px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
          Complete Survey
        </button>
      </div>
    </div>
  );
}

// --- AUTH PAGES ---
function Login({ onAuth }) {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '60px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '450px', textAlign: 'center' }}>
        <h1 style={{ color: '#4c51bf', fontSize: '42px', marginBottom: '10px' }}>Welcome</h1>
        <p style={{ marginBottom: '40px', color: '#718096' }}>Login to your administrator account</p>
        <input placeholder="Email" onChange={v => setE(v.target.value)} style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '15px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" onChange={v => setP(v.target.value)} style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '25px', boxSizing: 'border-box' }} />
        <button onClick={async () => {
          try {
            const res = await axios.post(`${API_BASE}/auth/login`, { email: e, password: p });
            if (res.data.success) onAuth(res.data.user);
          } catch (err) { alert("Invalid credentials provided."); }
        }} style={{ width: '100%', padding: '20px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign In
        </button>
        <p style={{ marginTop: '30px' }}>No account? <Link to="/signup" style={{ color: '#4c51bf', fontWeight: 'bold' }}>Register Here</Link></p>
      </div>
    </div>
  );
}

function Signup() {
  const [n, setN] = useState('');
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '60px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '450px', textAlign: 'center' }}>
        <h1 style={{ color: '#48bb78', fontSize: '42px', marginBottom: '10px' }}>Sign Up</h1>
        <p style={{ marginBottom: '40px', color: '#718096' }}>Create your free admin account</p>
        <input placeholder="Full Name" onChange={v => setN(v.target.value)} style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '15px', boxSizing: 'border-box' }} />
        <input placeholder="Email Address" onChange={v => setE(v.target.value)} style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '15px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Create Password" onChange={v => setP(v.target.value)} style={{ width: '100%', padding: '20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '25px', boxSizing: 'border-box' }} />
        <button onClick={async () => {
          await axios.post(`${API_BASE}/auth/signup`, { name: n, email: e, password: p });
          alert("Account Created! You can now login."); window.location.href="/login";
        }} style={{ width: '100%', padding: '20px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
          Create Account
        </button>
        <p style={{ marginTop: '30px' }}><Link to="/login" style={{ color: '#48bb78', fontWeight: 'bold' }}>Back to Login</Link></p>
      </div>
    </div>
  );
}
