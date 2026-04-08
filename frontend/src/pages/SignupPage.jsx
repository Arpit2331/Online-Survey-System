import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Sending new user data to the Backend
      await axios.post('https://online-survey-system-backend.onrender.com/auth/signup', formData);
      alert("Account created successfully! Please login.");
      navigate('/'); // Redirect to Login page
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try a different email.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="Full Name" 
            style={styles.input}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          /><br/>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={styles.input}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          /><br/>
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.input}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          /><br/>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.text}>
          Already have an account? <span onClick={() => navigate('/')} style={styles.link}>Login here</span>
        </p>
      </div>
    </div>
  );
};

// Re-using the same styles for consistency
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
  input: { width: '90%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' },
  button: { width: '100%', padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  link: { color: '#3498db', cursor: 'pointer', textDecoration: 'underline' },
  text: { marginTop: '20px', fontSize: '14px' }
};

export default SignupPage;
