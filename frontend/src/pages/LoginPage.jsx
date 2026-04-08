import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending credentials to the Backend
      const res = await axios.post('https://online-survey-system-backend.onrender.com/auth/login', { email, password });
      
      // If successful, pass user data to App.jsx to unlock the Dashboard
      onLoginSuccess(res.data.user);
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Invalid email or password"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Survey System Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          /><br/>
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          /><br/>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.text}>
          New here? <span onClick={() => navigate('/signup')} style={styles.link}>Create an account</span>
        </p>
      </div>
    </div>
  );
};

// Simple Styles
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
  input: { width: '90%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' },
  button: { width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  link: { color: '#3498db', cursor: 'pointer', textDecoration: 'underline' },
  text: { marginTop: '20px', fontSize: '14px' }
};

export default LoginPage;
