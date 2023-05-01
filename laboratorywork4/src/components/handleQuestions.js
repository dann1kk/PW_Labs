import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "../App.css";

function ShowQuestions(props) {
  const { quizId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState(0);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    console.log(props.questions);
  }, []);

  useEffect(() => {
    setSelectedAnswer("");
  }, [currentIndex]);

  const handleAnswers = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleQuestion = async () => {
    const userId = parseInt(localStorage.getItem("user-info"));
    const questionId = props.questions[currentIndex].id;
    const postData = {
      data: {
        question_id: questionId,
        answer: selectedAnswer,
        user_id: userId,
      },
    };

    try {
      const res = await axios.post(
        `https://late-glitter-4431.fly.dev/api/v54/quizzes/${quizId}/submit`,
        postData,
        {
          headers: {
            "X-Access-Token": process.env.REACT_APP_ACCESS_TOKEN,
          },
        }
      );

      if (res.data.correct) setResult((prevState) => prevState + 1);
    } catch (error) {
      console.log(error);
    }

    if (currentIndex === props.questions.length - 1) {
      setIsOver(true);
      console.log(result);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };


  return (
    <div>
      {isOver ? (
        <div className="main">
          <div className="card-body">
            <h3 className="card-title">Your results:</h3>
            <h2 className="card-subtitle">
              {result} out of {props.questions.length}
            </h2>
            <Link to={`/main`}>
              <button className="start-quiz">Return</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="main">
          <div className="pass-quiz-card">
            {props.questions[currentIndex]?.question}
            <div className="answers">
              {props.questions[currentIndex]?.answers.map((answer, index) => (
                <div className="question-answers" key={index}>
                  <input
                    type="radio"
                    name={props.questions[currentIndex].question}
                    value={answer}
                    onChange={handleAnswers}
                    checked={selectedAnswer === answer}
                  />
                  <label htmlFor={answer}>{answer}</label>
                </div>
              ))}
            </div>
            <div className="next-button">
              <button className="start-quiz" onClick={handleQuestion}>
                Next 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowQuestions;
