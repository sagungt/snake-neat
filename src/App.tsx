import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/app.css";

// TODO implement autoplay snake in background
export default function App() {
  const canvasSetup = () => {
    const canvas = document.getElementById("bg") as HTMLCanvasElement;
    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const width = canvas.width - (canvas.width % 20),
      height = canvas.height - (canvas.height % 20);
    // const ratio = [width / 20, height / 20];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCtx!.fillStyle = "#fff";
    canvasCtx?.fillRect(
      (canvas.width - width) / 2,
      (canvas.height - height) / 2,
      width,
      height
    );
  };
  useEffect(() => {
    canvasSetup();
    document.title = "Snake Neat";
  });
  return (
    <>
      <div className="menu">
        <canvas id="bg"></canvas>
        <div className="menu-container">
          <div>
            <h1 className="title">Snake Neat</h1>
          </div>
          <div className="menu-list">
            <Link to={"/play"} id="play">
              Play
            </Link>
            <Link to={"/train"} id="train">
              Train Snake
            </Link>
            <Link to={"/auto-astar"} id="autoplay-astar">
              Autoplay with A*
            </Link>
            <Link to={"/auto-ai"} id="autoplay-ai">
              Autoplay with AI
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
