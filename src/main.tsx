// import ReactDOM from "react-dom/client";
// import App from "./App.tsx";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <>
//     <App />
//   </>
// );

// 이제 ReactDOM 를 사용하는 방식으로 렌더를 하면 build 과정에서 오류남
//따라서 다른 방식으로 사용

import * as ReactDOMClient from "react-dom/client";

import App from "./App.tsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Error render root");
const root = ReactDOMClient.createRoot(rootEl);
root.render(
  <>
    <App />
  </>
);
