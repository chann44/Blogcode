import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useFetch } from "./hooks/final";

function App() {
  const { error, status, data } = useFetch(
    "https://pokeapi.co/api/v2/pokemon/ditto"
  );

  return (
    <div className="App">
      <h1>PokeMon Details</h1>
      {JSON.stringify(data)}
    </div>
  );
}

export default App;
