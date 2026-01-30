import React, { useState } from 'react';
import '../styles/component/Quiz.css';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
      setShowResults(true);
      if (onComplete) onComplete(score);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.correct);
      if (userAnswer === correctOption?.id) {
        correct++;
      }
    });
    setScore(Math.round((correct / questions.length) * 100));
  };

  if (showResults) {
    return (
      <div className="quiz-results">
        <h3>Quiz Results</h3>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{score}%</span>
          </div>
          <p className="score-message">
            {score >= 80 ? 'Excellent!' : 
             score >= 60 ? 'Good job!' : 
             'Keep practicing!'}
          </p>
        </div>
        
        <div className="answers-review">
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctOption = question.options.find(opt => opt.correct);
            const isCorrect = userAnswer === correctOption?.id;
            
            return (
              <div key={index} className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}>
                <p><strong>Q{index + 1}:</strong> {question.question}</p>
                <p className="answer-status">
                  {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </p>
                {!isCorrect && (
                  <p className="correct-answer">
                    Correct answer: {correctOption?.text}
                  </p>
                )}
                {question.explanation && (
                  <p className="explanation">{question.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>Test Your Knowledge</h3>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="quiz-question">
        <h4>{question.question}</h4>
        <div className="options-list">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`option-item ${answers[question.id] === option.id ? 'selected' : ''}`}
              onClick={() => handleAnswer(question.id, option.id)}
            >
              <span className="option-letter">{option.id}.</span>
              <span className="option-text">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-controls">
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!answers[question.id]}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;