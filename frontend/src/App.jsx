import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

// API URL CONFIG
const API_BASE = "https://online-survey-system-backend.onrender.com";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleAuth = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login onAuth={handleAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <Signup onAuth={handleAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      if (res.data.success) {
        onAuth(res.data.user, res.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none' }}>Login</button>
      </form>
      <p>New? <Link to="/signup">Create account</Link></p>
    </div>
  );
}

function Signup({ onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
      if (res.data.success) {
        onAuth(res.data.user, res.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none' }}>Sign Up</button>
      </form>
      <p>Have account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeSurvey, setActiveSurvey] = useState(null);

  const initSurvey = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/surveys`, {
        title,
        description: desc,
        creator_email: user.email
      });
      if (res.data.success) {
        setActiveSurvey(res.data.surveyId);
        alert("Survey Started!");
      }
    } catch (err) {
      alert("Error starting survey");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: <b>{user.email}</b></p>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Create New Survey</h3>
        <input placeholder="Survey Title" onChange={e => setTitle(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '100%' }} />
        <textarea placeholder="Description" onChange={e => setDesc(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '100%' }} />
        <button onClick={initSurvey} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none' }}>Initialize Survey</button>
      </div>
      <button onClick={onLogout} style={{ marginTop: '20px', color: 'red' }}>Logout</button>
    </div>
  );
}
