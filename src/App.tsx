import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ISnakeConfig } from "./interfaces";
import Snake from "./snake/TestSnake";
import { models } from "./snake/models";
import "./styles/app.css";
const neataptic = require("neataptic");

let snake: Snake | undefined;
let loop: NodeJS.Timer;
const config: ISnakeConfig = {
  displaySize: {
    x: window.innerWidth,
    y: window.innerHeight,
  },
  initialSnakeLength: 1,
  growWhenEating: true,
  borderWalls: true,
  canEatSelf: true,
  gridSize: 10 * 5,
};
const ai = false;

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
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
  const snakeInit = () => {
    let network;
    if (ai) network = neataptic.Network.fromJSON(models[0].value.model);
    const width =
      canvas.current!.width - (canvas.current!.width % config.gridSize);
    const height =
      canvas.current!.height - (canvas.current!.height % config.gridSize);
    let additionalConfig = {
      displaySize: {
        x: width,
        y: height,
      },
    };
    if (!ai)
      additionalConfig = {
        ...additionalConfig,
        ...{ heuristic: "euclidean", astarVersion: 2 },
      };
    snake = new Snake(
      {
        ...config,
        ...additionalConfig,
      },
      ai ? network : null
    );
  };
  const start = () => {
    snakeInit();
    loop = setInterval(() => {
      const canvasCtx = canvas.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const width =
        canvas.current!.width - (canvas.current!.width % config.gridSize);
      const height =
        canvas.current!.height - (canvas.current!.height % config.gridSize);
      const adjustedHeight = (canvas.current!.height - height) / 2;
      const adjustedWidth = (canvas.current!.width - width) / 2;
      if (ai) {
        snake!.look();
      } else {
        snake!.findFood();
      }
      snake!.showCanvas(canvasCtx, adjustedWidth, adjustedHeight);
      snake!.move(canvasCtx, adjustedWidth, adjustedHeight);
      // clearInterval(loop);
      if (snake!.isDead()) {
        clearInterval(loop);
        setTimeout(() => {
          start();
        }, 3000);
      }
    }, 100);
  };
  useEffect(() => {
    canvasSetup();
    document.title = "Snake Neat";
    start();
    return () => {
      clearInterval(loop);
    };
  });
  return (
    <>
      <div className="menu">
        <canvas id="bg" ref={canvas}></canvas>
        <div className="menu-container">
          <div>
            <h1 className="title">Snake Neat</h1>
          </div>
          <div className="menu-list">
            <Link to={"/snake-neat/play"} id="play">
              Play
            </Link>
            <Link to={"/snake-neat/train"} id="train">
              Train Snake
            </Link>
            <Link to={"/snake-neat/auto-astar"} id="autoplay-astar">
              Autoplay with A*
            </Link>
            <Link to={"/snake-neat/auto-ai"} id="autoplay-ai">
              Autoplay with AI
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
