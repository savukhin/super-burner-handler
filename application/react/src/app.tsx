// import React from 'react';
// // import ReactDom from 'react-dom/client';
// import ReactDOM from "react-dom/client";

// // const mainElement = document.createElement('div');
// // document.body.appendChild(mainElement);

// // const App = () => {
// //   return (
// //     <h1>
// //       Hi from a react app
// //     </h1>
// //   )
// // }

// // ReactDom.render(<App />, mainElement);

// // reportWebVitals();

// // var global = global || window;
// // var Buffer = Buffer || [];
// // var process = process || {
// //   env: { DEBUG: undefined },
// //   version: []
// // };

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(
//   <h1> Hello World! </h1>
// );


import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(<h1> Hello World! </h1>, document.querySelector('#root'));