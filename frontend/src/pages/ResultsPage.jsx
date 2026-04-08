import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`https://online-survey-system-backend.onrender.com/api/surveys/${id}/responses`);
        setResponses(res.data);
      } catch (err) { console.error(err); }
    };
    fetchResults();
  }, [id]);

  return (
    <div style={{ padding: '60px 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>← Back to Dashboard</Link>
      <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '24px' }}>Campaign Analytics</h2>
      <p style={{ color: '#64748b', marginBottom: '40px' }}>Analyzing raw data submissions for project ID: {id}</p>
      
      {responses.length === 0 ? (
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>No data points collected yet.</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '20px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Question</th>
                <th style={{ padding: '20px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Submission</th>
                <th style={{ padding: '20px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Captured At</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr key={i} style={{ borderBottom: i === responses.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '20px', fontWeight: '600' }}>{r.question_text}</td>
                  <td style={{ padding: '20px' }}>{r.answer_text}</td>
                  <td style={{ padding: '20px', color: '#94a3b8', fontSize: '13px' }}>{new Date(r.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
