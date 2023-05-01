import React, { useState, useEffect } from "react";
import axios from "axios";
import HandleQuestions from "./handleQuestions";
import { useParams } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const { quizId } = useParams();

  useEffect(() => {
    axios
      .get(`https://late-glitter-4431.fly.dev/api/v54/quizzes/${quizId}`, {
        headers: { "X-Access-Token": process.env.REACT_APP_ACCESS_TOKEN },
      })
      .then((res) => {
        const a = res.data;
        setQuestions(a.questions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [quizId]);

  return (
    <>
      <h2>{questions.title}</h2>
      <HandleQuestions questions={questions} />
    </>
  );
}

export default Quiz;
