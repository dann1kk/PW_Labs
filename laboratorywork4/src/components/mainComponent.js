import React, { Component } from "react";
import Main from "./mainPage";
import Header from "./header";
import { Route, Routes } from "react-router-dom";
import Login from "./login";
import Quiz from "./quiz";
import Quizzes from "./quizzes";
import CheckUser from "./checkUser";


export default function MainComponent() {

      return (
    <div>
      <Header />
      <Routes>
        <Route path="/main" element={<CheckUser Comp={Main} />} />
        <Route path="/login" element={<CheckUser Comp={Login} />} />
        <Route exact path="/quizzes" element={<CheckUser Comp={Quizzes} />} />
        <Route path="/quizzes/:quizId" element={<CheckUser Comp={Quiz}  />} />
      </Routes>
    </div>
  );
}
