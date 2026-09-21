import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import QuizServices from "../../services/QuizServices";
import EnrollmentServices from "../../services/EnrollmentServices";
import ProgressBar from "../shared/ProgressBar";
import "./QuizAttempt.css";

function QuizAttempt() {
  const { courseId, quizId } = useParams();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const q = await QuizServices.Get(quizId);
      setQuiz(q);
      setAnswers(new Array(q?.questions?.length || 0).fill(null));
      setLoading(false);
    })();
  }, [quizId]);

  if (loading) return <div className="container py-5">Loading quiz…</div>;
  if (!quiz) return <div className="container py-5">Quiz not found.</div>;

  const questions = quiz.questions || [];
  const question = questions[current];
  const progressPercent = Math.round(((current + 1) / questions.length) * 100);

  const selectOption = (optIndex) => {
    const next = [...answers];
    next[current] = optIndex;
    setAnswers(next);
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      toast.error("Please answer every question before submitting");
      return;
    }

    let correct = 0;
    let totalMarks = 0;
    let earnedMarks = 0;
    questions.forEach((q, i) => {
      const marks = q.marks || 1;
      totalMarks += marks;
      if (answers[i] === q.correctAnswer) {
        correct += 1;
        earnedMarks += marks;
      }
    });

    const percent = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const passed = percent >= (quiz.passingMarks || 0);

    const resultData = {
      score: earnedMarks,
      total: totalMarks,
      correct,
      incorrect: questions.length - correct,
      percent,
      passed,
      attemptedAt: new Date().toISOString(),
    };

    const allCourseQuizzes = await QuizServices.ByCourse(courseId);
    await EnrollmentServices.RecordQuizResult(
      user.uid,
      courseId,
      quizId,
      resultData,
      allCourseQuizzes.filter((q) => q.status).length
    );

    setResult(resultData);
    setSubmitted(true);
  };

  if (submitted && result) {
    return (
      <div className="container py-5 quiz-result-page">
        <div className="quiz-result-card mx-auto">
          <i className={`fa ${result.passed ? "fa-check-circle text-success" : "fa-times-circle text-danger"} result-icon`} />
          <h3 className="mt-3 mb-1">{result.passed ? "Passed!" : "Not Passed"}</h3>
          <p className="text-muted mb-4">{quiz.title}</p>

          <div className="row g-3 text-center mb-4">
            <div className="col-4">
              <div className="result-stat">{result.percent}%</div>
              <small className="text-muted">Score</small>
            </div>
            <div className="col-4">
              <div className="result-stat text-success">{result.correct}</div>
              <small className="text-muted">Correct</small>
            </div>
            <div className="col-4">
              <div className="result-stat text-danger">{result.incorrect}</div>
              <small className="text-muted">Incorrect</small>
            </div>
          </div>

          <Link to={`/courses/${courseId}`} className="btn btn-primary px-4">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 quiz-attempt-page">
      <div className="quiz-attempt-card mx-auto">
        <div className="quiz-breadcrumb mb-2">
          {quiz.courseName} <i className="fa fa-chevron-right mx-1 small" /> {quiz.topicName} <i className="fa fa-chevron-right mx-1 small" /> {quiz.title}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">Question {current + 1} of {questions.length}</span>
          <span className="text-muted small">{progressPercent}%</span>
        </div>
        <ProgressBar percent={progressPercent} />

        <h5 className="mt-4 mb-4">{question.question}</h5>

        <div className="quiz-options-list">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${answers[current] === i ? "selected" : ""}`}
              onClick={() => selectOption(i)}
              type="button"
            >
              <span className="quiz-option-radio" />
              {opt}
            </button>
          ))}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              disabled={answers[current] === null}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default QuizAttempt;
