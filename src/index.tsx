import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import Factory from "./Factory";
import Play from "./Play";
import AutoAI from "./AutoAI";
import AutoAstar from "./AutoAstar";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/snake-neat" element={<App />} />
        <Route path="/snake-neat/auto-astar" element={<AutoAstar />} />
        <Route path="/snake-neat/auto-ai" element={<AutoAI />} />
        <Route path="/snake-neat/play" element={<Play />} />
        <Route path="/snake-neat/train" element={<Factory />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
