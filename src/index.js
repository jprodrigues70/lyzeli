import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/main.sass";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Store from "./store";
import ParallelStore from "./parallelStore";

ReactDOM.render(
  <React.StrictMode>
    <ParallelStore>
      <Store>
        <App />
      </Store>
    </ParallelStore>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
