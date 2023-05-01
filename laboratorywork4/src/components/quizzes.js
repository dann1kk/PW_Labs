import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function Quizes() {
  const [quizzes, setQuizzes] = useState([]);
  const userId = localStorage.getItem("user-info");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('https://late-glitter-4431.fly.dev/api/v54/quizzes', {
          headers: {
            "X-Access-Token": process.env.REACT_APP_ACCESS_TOKEN
          }
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="mainQuizes">
      <div className="main-name">
        <h1 className="title-head">Choose and Start a Quiz</h1>
      </div>
      <div className="quizes-here">
        {quizzes.map(quiz => (
          <Link to={`/quizzes/${quiz.id}`} key={quiz.id}>
            <div className='quiz'>
              <h2 className="title-head">Quiz</h2>
              <p className="title">Title: {quiz.title}</p>
              <p className="title">Questions count: {quiz.questions_count}</p>
              <input type="button" className="start-quiz" value="Start Quiz" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Quizes;

