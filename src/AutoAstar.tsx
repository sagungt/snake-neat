import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// TODO implement autoplay snake with A* algorithm
export default function AutoAstar() {
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    document.title = "Autoplay with A star";
  });

  const playHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(true);
    setPause(false);
  };

  const pauseHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(false);
    setPause(true);
  };

  const stopHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(false);
    setPause(false);
  };
  return (
    <div className="playground">
      <div className="pause">
        {play ? (
          <>
            <button className="btn btn-primary" onClick={pauseHandler}>
              <i className="fa fa-pause"></i>
            </button>
            <button className="btn btn-danger" onClick={stopHandler}>
              <i className="fa fa-stop"></i>
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      <div className="score">
        {play ? (
          <>
            <h2>
              Score : <span id="score"></span>
            </h2>
          </>
        ) : (
          ""
        )}
      </div>

      <canvas id="playfield"></canvas>
      <div className="menu-container">
        <div className="back">
          <Link to="/">
            <i className="fa fa-arrow-left"></i>
          </Link>
        </div>
        <div>
          <div>
            <h2 className="title">Play Snake Game with A*</h2>
          </div>
          <div>
            <button className="btn btn-primary play" onClick={playHandler}>
              {pause ? "Resume" : "Play"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
