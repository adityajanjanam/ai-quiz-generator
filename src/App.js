import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from './config';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#2d3748',
    animation: 'fadeIn 0.5s ease-out'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    background: 'linear-gradient(45deg, #4299e1, #48bb78)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '1.5rem'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    animation: 'slideUp 0.5s ease-out'
  },
  input: {
    padding: '0.75rem 1rem',
    width: '300px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
    }
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4299e1',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#3182ce',
      transform: 'translateY(-1px)'
    },
    '&:disabled': {
      backgroundColor: '#cbd5e0',
      cursor: 'not-allowed'
    }
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    margin: '0 4px',
    backgroundColor: '#4299e1',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out'
  },
  quizContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.5s ease-out'
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  quizTitle: {
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  score: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }
  },
  questionText: {
    color: '#2d3748',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  optionsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  option: {
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f7fafc',
      borderColor: '#cbd5e0'
    },
    '&.selected': {
      backgroundColor: '#ebf8ff',
      borderColor: '#4299e1',
      color: '#2b6cb0'
    },
    '&.correct': {
      backgroundColor: '#f0fff4',
      borderColor: '#48bb78',
      color: '#2f855a'
    },
    '&.incorrect': {
      backgroundColor: '#fff5f5',
      borderColor: '#f56565',
      color: '#c53030'
    }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  '@keyframes slideUp': {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  '@keyframes bounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' }
  }
};

function App() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setError(null);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Generate a quiz with 5 multiple choice questions about ${topic}. 
      Format the response as a JSON array where each question has:
      - question: string
      - options: array of 4 strings
      - answer: string (the correct answer)
      
      Example format:
      [
        {
          "question": "What is...?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Option 1"
        }
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        setQuiz(quizData);
      } else {
        throw new Error('Invalid response format from AI');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
      setQuiz([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, option) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const isOptionSelected = (questionIndex, option) => {
    return selectedAnswers[questionIndex] === option;
  };

  const isOptionCorrect = (questionIndex, option) => {
    if (!showResults) return false;
    return quiz[questionIndex].answer === option;
  };

  const isOptionIncorrect = (questionIndex, option) => {
    if (!showResults) return false;
    return selectedAnswers[questionIndex] === option && quiz[questionIndex].answer !== option;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Quiz Generator</h1>
        <p style={styles.subtitle}>Test your knowledge on any topic</p>
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter any topic (e.g., Quantum Physics, Ancient Rome, Machine Learning)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={generateQuiz} 
          style={styles.button}
          disabled={!topic.trim() || loading}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fff5f5',
          color: '#c53030',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={styles.loading}>
          <div style={styles.loadingDot}></div>
          <div style={{...styles.loadingDot, animationDelay: '0.2s'}}></div>
          <div style={{...styles.loadingDot, animationDelay: '0.4s'}}></div>
        </div>
      )}

      {quiz.length > 0 && (
        <div style={styles.quizContainer}>
          <div style={styles.quizHeader}>
            <h2 style={styles.quizTitle}>Quiz on {topic}</h2>
            {showResults && (
              <div style={styles.score}>
                Score: {score}/{quiz.length}
              </div>
            )}
          </div>
          
          {quiz.map((q, index) => (
            <div key={index} style={styles.questionCard}>
              <div style={styles.questionText}>{q.question}</div>
              <ul style={styles.optionsList}>
                {q.options.map((opt, idx) => (
                  <li 
                    key={idx} 
                    style={{
                      ...styles.option,
                      ...(isOptionSelected(index, opt) && { ...styles.option['&.selected'] }),
                      ...(isOptionCorrect(index, opt) && { ...styles.option['&.correct'] }),
                      ...(isOptionIncorrect(index, opt) && { ...styles.option['&.incorrect'] })
                    }}
                    onClick={() => handleAnswerSelect(index, opt)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {!showResults && Object.keys(selectedAnswers).length === quiz.length && (
            <button 
              onClick={checkAnswers}
              style={styles.button}
            >
              Check Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;