import React, {
  useContext,
  useEffect,
  useState
} from 'react';

import axios from 'axios';

import {
  ArrowLeft,
  Sparkles,
  Loader2,
  MessageSquare,
  Target,
  CheckCircle,
  AlertCircle,
  Brain,
  Send,
  History,
  Award
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';


function InterviewPrep() {

  const navigate = useNavigate();

  const { token, user } =
    useContext(AuthContext);


  const [interviewType, setInterviewType] =
    useState('Technical');

  const [difficulty, setDifficulty] =
    useState('Medium');


  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState({});

  const [feedback, setFeedback] =
    useState({});


  const [savedHistory, setSavedHistory] =
    useState([]);

  const [loadingHistory, setLoadingHistory] =
    useState(true);


  const [loading, setLoading] =
    useState(false);

  const [evaluating, setEvaluating] =
    useState({});

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');


  // Load saved interview history
  // This does NOT call AI.
  useEffect(() => {

    const loadInterviewHistory =
      async () => {

        if (!token) {
          setLoadingHistory(false);
          return;
        }

        try {

          setLoadingHistory(true);

          const response =
            await axios.get(
              'http://localhost:5000/api/interview/history',
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setSavedHistory(
            response.data.history || []
          );

        } catch (error) {

          console.error(
            'Load Interview History Error:',
            error
          );

        } finally {

          setLoadingHistory(false);

        }
      };


    loadInterviewHistory();

  }, [token]);


  // Generate new interview questions
  const handleGenerateQuestions =
    async () => {

      if (!token) {

        setError(
          'Not authorized. Please log in again.'
        );

        return;
      }


      try {

        setLoading(true);

        setError('');
        setMessage('');

        setQuestions([]);
        setAnswers({});
        setFeedback({});


        const response =
          await axios.post(
            'http://localhost:5000/api/interview/questions',

            {
              interviewType,
              difficulty,
              targetRole:
                user?.targetRole ||
                'Software Engineer'
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        setQuestions(
          response.data.questions || []
        );

        setMessage(
          'Interview questions generated successfully.'
        );


      } catch (error) {

        setError(
          error.response?.data?.message ||
          'Failed to generate interview questions.'
        );

      } finally {

        setLoading(false);

      }
    };


  // Update answer
  const handleAnswerChange =
    (index, value) => {

      setAnswers(
        (previous) => ({
          ...previous,
          [index]: value
        })
      );

    };


  // Evaluate answer
  const handleEvaluateAnswer =
    async (index) => {

      const answer =
        answers[index];


      if (!answer || !answer.trim()) {

        setError(
          'Please write your answer before submitting.'
        );

        return;
      }


      try {

        setEvaluating(
          (previous) => ({
            ...previous,
            [index]: true
          })
        );

        setError('');


        const response =
          await axios.post(
            'http://localhost:5000/api/interview/evaluate',

            {
              question:
                questions[index].question ||
                questions[index],

              answer,

              targetRole:
                user?.targetRole ||
                'Software Engineer',

              interviewType,

              difficulty
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const newFeedback =
          response.data.feedback;


        setFeedback(
          (previous) => ({
            ...previous,
            [index]: newFeedback
          })
        );


        // Add newly evaluated answer
        // to saved history immediately.
        setSavedHistory(
          (previous) => [
            ...previous,
            {
              interviewType,
              difficulty,

              question:
                questions[index].question ||
                questions[index],

              answer,

              score:
                newFeedback.score || 0,

              feedback:
                newFeedback.feedback || '',

              strengths:
                newFeedback.strengths || [],

              improvements:
                newFeedback.improvements || [],

              completedAt:
                new Date().toISOString()
            }
          ]
        );


        setMessage(
          'Answer evaluated successfully.'
        );


      } catch (error) {

        setError(
          error.response?.data?.message ||
          'Failed to evaluate your answer.'
        );

      } finally {

        setEvaluating(
          (previous) => ({
            ...previous,
            [index]: false
          })
        );

      }
    };


  return (

    <div className="resume-page">

      <div className="resume-container">


        {/* Back Button */}

        <button
          className="profile-back-button"
          onClick={() =>
            navigate('/dashboard')
          }
        >

          <ArrowLeft size={18} />

          Back to Dashboard

        </button>


        {/* Page Header */}

        <div className="resume-header">

          <div className="resume-icon-large">

            <MessageSquare size={32} />

          </div>


          <div>

            <h1>
              AI Interview Preparation
            </h1>

            <p>
              Practice role-specific interview
              questions with AI-powered feedback.
            </p>

          </div>

        </div>


        {/* Interview Configuration */}

        <div className="resume-card">

          <div className="resume-card-header">

            <h2>

              <Sparkles size={20} />

              Start Mock Interview

            </h2>


            <p>
              Configure your interview and generate
              personalized questions for your target role.
            </p>

          </div>


          {error && (

            <div className="auth-error">

              <AlertCircle size={18} />

              {error}

            </div>

          )}


          {message && (

            <div className="auth-success">

              <CheckCircle size={18} />

              {message}

            </div>

          )}


          <div className="interview-options">


            {/* Interview Type */}

            <div className="interview-option">

              <label>

                <MessageSquare size={16} />

                Interview Type

              </label>


              <select
                value={interviewType}
                onChange={(event) =>
                  setInterviewType(
                    event.target.value
                  )
                }
              >

                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR / Behavioral
                </option>

                <option value="Coding">
                  Coding
                </option>

                <option value="Mixed">
                  Mixed
                </option>

              </select>

            </div>


            {/* Difficulty */}

            <div className="interview-option">

              <label>

                <Target size={16} />

                Difficulty

              </label>


              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value
                  )
                }
              >

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>

              </select>

            </div>


          </div>


          <button
            className="resume-analyze-button"
            onClick={handleGenerateQuestions}
            disabled={loading}
          >

            {loading ? (

              <Loader2
                size={18}
                className="spin-icon"
              />

            ) : (

              <Sparkles size={18} />

            )}


            {loading
              ? 'Generating Questions...'
              : 'Generate Interview Questions'}

          </button>


        </div>


        {/* Loading Saved History */}

        {loadingHistory && (

          <div className="resume-card">

            <div className="resume-card-header">

              <h2>

                <Loader2
                  size={20}
                  className="spin-icon"
                />

                Loading Interview History

              </h2>

              <p>
                Loading your previously evaluated
                interview answers.
              </p>

            </div>

          </div>

        )}


        {/* Saved Interview History */}

        {!loadingHistory &&
          savedHistory.length > 0 && (

          <div className="resume-analysis-container">

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <History size={20} />

                  Previous Interview Evaluations

                </h2>

                <p>
                  Your previously evaluated interview
                  answers are saved here.
                </p>

              </div>


              <div className="analysis-list">

                {savedHistory
                  .slice()
                  .reverse()
                  .map(
                    (item, index) => (

                      <div
                        className="interview-history-item"
                        key={
                          item._id ||
                          `${item.completedAt}-${index}`
                        }
                      >

                        <div className="interview-question-header">

                          <div className="interview-question-number">

                            {index + 1}

                          </div>


                          <div>

                            <span className="interview-question-label">

                              {item.interviewType ||
                                'Technical'}

                              {' • '}

                              {item.difficulty ||
                                'Medium'}

                            </span>


                            <h2>

                              {item.question}

                            </h2>

                          </div>

                        </div>


                        <div className="interview-answer-section">

                          <label>

                            <Brain size={17} />

                            Your Answer

                          </label>


                          <div className="roadmap-summary">

                            <p>
                              {item.answer}
                            </p>

                          </div>

                        </div>


                        <div className="interview-feedback">

                          <div className="interview-feedback-header">

                            <Sparkles size={19} />

                            <h3>
                              AI Feedback
                            </h3>

                          </div>


                          {item.score !== undefined && (

                            <div className="interview-score">

                              <span>
                                Score
                              </span>

                              <strong>
                                {item.score}/100
                              </strong>

                            </div>

                          )}


                          {item.feedback && (

                            <div className="interview-feedback-section">

                              <strong>
                                Feedback
                              </strong>

                              <p>
                                {item.feedback}
                              </p>

                            </div>

                          )}


                          {item.strengths?.length > 0 && (

                            <div className="interview-feedback-section">

                              <strong>
                                Strengths
                              </strong>


                              <div className="analysis-list">

                                {item.strengths.map(
                                  (
                                    strength,
                                    strengthIndex
                                  ) => (

                                    <div
                                      className="analysis-list-item strength-item"
                                      key={
                                        strengthIndex
                                      }
                                    >

                                      <CheckCircle
                                        size={17}
                                      />

                                      <span>
                                        {strength}
                                      </span>

                                    </div>

                                  )
                                )}

                              </div>

                            </div>

                          )}


                          {item.improvements?.length > 0 && (

                            <div className="interview-feedback-section">

                              <strong>
                                Areas to Improve
                              </strong>


                              <div className="analysis-list">

                                {item.improvements.map(
                                  (
                                    improvement,
                                    improvementIndex
                                  ) => (

                                    <div
                                      className="analysis-list-item improvement-item"
                                      key={
                                        improvementIndex
                                      }
                                    >

                                      <AlertCircle
                                        size={17}
                                      />

                                      <span>
                                        {improvement}
                                      </span>

                                    </div>

                                  )
                                )}

                              </div>

                            </div>

                          )}

                        </div>

                      </div>

                    )
                  )}

              </div>

            </div>

          </div>

        )}


        {/* Newly Generated Questions */}

        {questions.length > 0 && (

          <div className="resume-analysis-container">

            <div className="resume-card">

              <div className="resume-card-header">

                <h2>

                  <MessageSquare size={20} />

                  Current Mock Interview

                </h2>

                <p>
                  Answer the questions below and
                  submit each answer for AI evaluation.
                </p>

              </div>

            </div>


            {questions.map(
              (item, index) => {

                const questionText =
                  item.question || item;

                const currentFeedback =
                  feedback[index];


                return (

                  <div
                    className="resume-card interview-question-card"
                    key={index}
                  >


                    <div className="interview-question-header">

                      <div className="interview-question-number">

                        {index + 1}

                      </div>


                      <div>

                        <span className="interview-question-label">

                          {item.category ||
                            interviewType}

                        </span>


                        <h2>
                          {questionText}
                        </h2>

                      </div>

                    </div>


                    {/* Answer */}

                    <div className="interview-answer-section">

                      <label>

                        <Brain size={17} />

                        Your Answer

                      </label>


                      <textarea
                        value={
                          answers[index] || ''
                        }

                        onChange={(event) =>
                          handleAnswerChange(
                            index,
                            event.target.value
                          )
                        }

                        placeholder="Write your answer here..."

                        rows={6}
                      />


                      <button
                        className="resume-analyze-button"
                        onClick={() =>
                          handleEvaluateAnswer(index)
                        }

                        disabled={
                          evaluating[index]
                        }
                      >

                        {evaluating[index] ? (

                          <Loader2
                            size={18}
                            className="spin-icon"
                          />

                        ) : (

                          <Send size={18} />

                        )}


                        {evaluating[index]
                          ? 'Evaluating...'
                          : 'Submit Answer'}

                      </button>

                    </div>


                    {/* AI Feedback */}

                    {currentFeedback && (

                      <div className="interview-feedback">

                        <div className="interview-feedback-header">

                          <Sparkles size={19} />

                          <h3>
                            AI Feedback
                          </h3>

                        </div>


                        {currentFeedback.score !== undefined && (

                          <div className="interview-score">

                            <span>
                              Score
                            </span>

                            <strong>
                              {currentFeedback.score}/100
                            </strong>

                          </div>

                        )}


                        {currentFeedback.feedback && (

                          <div className="interview-feedback-section">

                            <strong>
                              Feedback
                            </strong>

                            <p>
                              {currentFeedback.feedback}
                            </p>

                          </div>

                        )}


                        {currentFeedback.strengths?.length > 0 && (

                          <div className="interview-feedback-section">

                            <strong>
                              Strengths
                            </strong>


                            <div className="analysis-list">

                              {currentFeedback.strengths.map(
                                (
                                  strength,
                                  strengthIndex
                                ) => (

                                  <div
                                    className="analysis-list-item strength-item"
                                    key={
                                      strengthIndex
                                    }
                                  >

                                    <CheckCircle
                                      size={17}
                                    />

                                    <span>
                                      {strength}
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}


                        {currentFeedback.improvements?.length > 0 && (

                          <div className="interview-feedback-section">

                            <strong>
                              Areas to Improve
                            </strong>


                            <div className="analysis-list">

                              {currentFeedback.improvements.map(
                                (
                                  improvement,
                                  improvementIndex
                                ) => (

                                  <div
                                    className="analysis-list-item improvement-item"
                                    key={
                                      improvementIndex
                                    }
                                  >

                                    <AlertCircle
                                      size={17}
                                    />

                                    <span>
                                      {improvement}
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );
}


export default InterviewPrep;