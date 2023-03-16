import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Assignments from "./Components/Assignments";
import Assignment from "./Components/Assignment";
import Home from "./Components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/assignments" element={<Assignments />}></Route>
      <Route path="/assignments/:assignmentId" element={<Assignment />}></Route>
    </Routes>
  );
}

export default App;
