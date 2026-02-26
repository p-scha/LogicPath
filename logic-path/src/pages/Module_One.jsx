import "./Module_One.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Module_One() {
  const lessons = [
    {
      title: "Module 1: Pathway to Logic",
      text: ""
    },
    {
      title: "What is logic?",
      text: `Logic, broadly speaking, is the study of arguments.

      Arguments are a sequence of statements including premises and a conclusion.
      Statements are declarative sentences which are truth-apt (can be true or false).
      Premises are statements intended to establish or justify a conclusion.
      The conclusion is the statement that is intended to be established as true.

            `
    },
    {
      title: "Argument Regimentation",
      text: `Many of the arguments that concern us are provided in natural or ordinary language, that is,
      language that we use in our everyday lives (such as English, Spanish, etc.).

      Regimenting an argument is the process of disambiguating an ordinary language argument.

      This can be done in two ways: 
      1) Identifying a natural language argument and translating it into premise/conclusion form;
      2) Identifying a natural language argument and translating it into a formal language.
        `
    }
  ];

  const [index, setIndex] = useState(0);

  return (
    <div className="module-one-bg">
      <div className="lesson-panel">
        <h2>{lessons[index].title}</h2>
        <p>{lessons[index].text}</p>

        <button onClick={() => setIndex(i => Math.min(i + 1, lessons.length - 1))}>
          Continue
        </button>

        <button onClick={() => setIndex(i => Math.max(i - 1, 0))}>
          Back
        </button>
      </div>
    </div>
  );
}