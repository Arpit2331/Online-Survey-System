import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TakeSurvey = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      const s = await axios.get(`https://online-survey-system-backend.onrender.com/api/surveys/public/${id}`);
      const q = await axios.get(`https://online-survey-system-backend.onrender.com/api/surveys/${id}/questions`);
      setSurvey(s.data); setQuestions(q.data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatted = Object.entries(answers).map(([qId, text]) => ({ question_id: qId, answer_text: text }));
    await axios.post('https://online-survey-system-backend.onrender.com/api/responses', { survey_id: id, answers: formatted });
    alert("Submitted!");
    window.location.reload();
  };

  if (!survey) return <div style={{textAlign: 'center', padding: '100px'}}>Loading Campaign...</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ background: '#fff', maxWidth: '600px', margin: '0 auto', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <h1>{survey.title}</h1>
        <p style={{color: '#64748b', marginBottom: '30px'}}>{survey.description}</p>
        <form onSubmit={handleSubmit}>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '12px' }}>{idx + 1}. {q.question_text}</label>
              
              {q.question_type === 'text' && (
                <input style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1'}} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} required />
              )}

              {q.question_type === 'yes_no' && (
                <div style={{display: 'flex', gap: '20px'}}>
                  {['Yes', 'No'].map(o => (
                    <label key={o}><input type="radio" name={`q${q.id}`} value={o} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} required /> {o}</label>
                  ))}
                </div>
              )}

              {q.question_type === 'multiple_choice' && (
                <div>
                  {q.options.map(o => (
                    <div key={o} style={{marginBottom: '5px'}}>
                      <label><input type="radio" name={`q${q.id}`} value={o} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} required /> {o}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" style={{ width: '100%', background: '#4f46e5', color: '#fff', padding: '16px', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Submit Response</button>
        </form>
      </div>
    </div>
  );
};

export default TakeSurvey;
