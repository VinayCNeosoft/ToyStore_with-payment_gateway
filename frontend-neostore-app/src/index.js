import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
/* React-Bootstrap doesn't depend on a very precise version of Bootstrap,
we don't ship with any included CSS. However, some stylesheet is required to use these components. */
import "bootstrap/dist/css/bootstrap.min.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = { count: 0, admin: false };

function reducer(state = initialState, actions) {
  console.log(state);
  switch (actions.type) {
    case "count":
      return { count: actions.payload };
    case "admin":
      return { admin: actions.payload };
    default:
      return state;
  }
}
const store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
