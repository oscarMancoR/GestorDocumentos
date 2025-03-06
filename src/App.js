import React from "react";
import Principal from "./pages/Principal"
import "./App.css";

import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header /> 
      <Principal />
    </div>
  );
};
export default App