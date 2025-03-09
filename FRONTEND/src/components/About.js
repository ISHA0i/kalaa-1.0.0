import React, { useState } from "react";

export default function About() {
  const [myStyle, setMyStyle] = useState({
    color: "black",
    backgroundColor: "white",
  });
  const [btntext, setBtnText] = useState("Enable Dark Mode");
  const toggleStyle = () => {
    if (myStyle.color === "white") {
      setMyStyle({
        color: "black",
        backgroundColor: "white",
      });
      setBtnText("Enable Dark Mode");
    } else {
      setMyStyle({
        color: "white",
        backgroundColor: "black",
      });
      setBtnText("Enable LIght Mode");
    }
  };

  return (
    <div style={ myStyle}>
      <div className="card" style={ myStyle}>
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="/" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary m-3"
        onClick={toggleStyle}
      >
        {btntext}
      </button>
    </div>
  );
}
