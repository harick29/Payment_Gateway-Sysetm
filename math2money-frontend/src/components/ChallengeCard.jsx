import { useEffect, useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";
import {
  generateQuestion,
  generateQuestionOfTheDay,
} from "../utils/questionGenerator";

function ChallengeCard({
  difficulty = "easy",
  daily = false,
  onCorrect,
}) {
  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const loadQuestion = () => {
    const newQuestion = daily
      ? generateQuestionOfTheDay()
      : generateQuestion(difficulty);

    setQuestionData(newQuestion);
    setAnswer("");
    setMessage("");
    setIsCorrect(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [difficulty, daily]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!answer) {
    setMessage("Please enter your answer.");
    setIsCorrect(false);
    return;
  }

  if (Number(answer) === questionData.answer) {
    setMessage(
      `Correct! You earned ₹${questionData.reward}.`
    );

    setIsCorrect(true);

    onCorrect(questionData.reward, questionData);
  } else {
    setMessage("Not right. Try again!");
    setIsCorrect(false);
  }
};

  if (!questionData) {
    return null;
  }

  const title = daily
    ? "Question of the Day"
    : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge`;

  return (
    <div className="challenge-card">

      <div className="challenge-top">

        <div>
          <span className="section-label">
            {daily ? "⭐ DAILY SPECIAL" : "DAILY CHALLENGE"}
          </span>

          <h2>{title}</h2>
        </div>

        <div className="reward-pill">
          +₹{questionData.reward}
        </div>

      </div>

      <div className="question-area">

        <div className="calculator-box">
          <Calculator size={30} />
        </div>

        <p className="question-text">
          Solve the following question
        </p>

        <h1>{questionData.question} = ?</h1>

        <form
          onSubmit={handleSubmit}
          className="answer-form"
        >

          <input
            type="number"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            type="submit"
            className="submit-button"
          >
            Submit Answer
          </button>

        </form>

        {message && (
          <div
            className={`challenge-message ${
              isCorrect ? "success" : "error"
            }`}
          >
            {isCorrect && <CheckCircle2 size={18} />}

            <span>{message}</span>
          </div>
        )}

        {isCorrect && (
          <button
            className="next-question-button"
            onClick={loadQuestion}
          >
            Next Question
          </button>
        )}

      </div>
        {isCorrect && (
  <div className="celebration-overlay">

    <div className="celebration-popup">

      <div className="celebration-icon">
        🎉
      </div>

      <h1>Correct!</h1>

      <p className="celebration-message">
        Amazing! You solved it correctly.
      </p>

      <div className="reward-display">
        <span>Reward Earned</span>
        <strong>+₹{questionData.reward}</strong>
      </div>

      <p className="celebration-subtext">
        Keep going and earn more!
      </p>

      <button
        className="next-question-button celebration-button"
        onClick={loadQuestion}
      >
        Next Question →
      </button>

    </div>

  </div>
)}
    </div>
  );
}

export default ChallengeCard;