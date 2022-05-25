import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "./components/Slider";
import Switch from "./components/Switch";
import Snake from "./snake/TestSnake";
import { ISnakeConfig } from "./interfaces";
import "./styles/play.css";

let snake: Snake | undefined;
let loop: NodeJS.Timer;

export default function Play() {
  const [gridSize, setGridSize] = useState(10 * 5);
  const [increment, setIncrement] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [pause, setPause] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [play, setPlay] = useState(false);
  const [config, setConfig] = useState<ISnakeConfig>({
    gridSize: 10 * 5,
    displaySize: {
      x: window.innerWidth,
      y: window.innerHeight,
    },
    growWhenEating: true,
    borderWalls: true,
    canEatSelf: true,
    initialSnakeLength: 2,
  });
  const canvas = useRef<HTMLCanvasElement>(null);
  const scoreElement = useRef<HTMLSpanElement>(null);

  const moveHandler = ({ key }: KeyboardEvent) => {
    if (!snake) return;
    let direction = 270;
    switch (key) {
      case "ArrowUp":
        direction = 0;
        break;
      case "ArrowRight":
        direction = 270;
        break;
      case "ArrowDown":
        direction = 180;
        break;
      case "ArrowLeft":
        direction = 90;
        break;
      default:
        break;
    }
    if (Math.abs(snake!.getDirection() - direction) === 180) return;
    setTimeout(() => {
      snake!.setDirection(direction);
    }, 50);
  };

  const drawGrid = useCallback(
    (
      canvasCtx: CanvasRenderingContext2D,
      width: number,
      height: number,
      ratio: any
    ) => {
      const adjustedHeight = (canvas.current!.height - height) / 2;
      const adjustedWidth = (canvas.current!.width - width) / 2;
      canvasCtx!.strokeStyle = "#ccc";
      canvasCtx?.beginPath();
      canvasCtx?.moveTo(adjustedWidth, adjustedHeight);
      canvasCtx?.lineTo(adjustedWidth, height + adjustedHeight);
      canvasCtx?.lineTo(width + adjustedWidth, height + adjustedHeight);
      canvasCtx?.lineTo(width + adjustedWidth, adjustedHeight);
      canvasCtx?.lineTo(adjustedWidth, adjustedHeight);
      canvasCtx?.stroke();
      for (let j = 0; j < ratio.x; j += 1) {
        const x1 = adjustedWidth + j * gridSize;
        const x2 = height + adjustedHeight;
        canvasCtx!.strokeStyle = "#ccc";
        canvasCtx?.beginPath();
        canvasCtx?.moveTo(x1, adjustedHeight);
        canvasCtx?.lineTo(x1, x2);
        canvasCtx?.stroke();
      }
      for (let i = 0; i < ratio.y; i += 1) {
        const x1 = adjustedHeight + i * gridSize;
        const x2 = width + adjustedWidth;
        canvasCtx!.strokeStyle = "#ccc";
        canvasCtx?.beginPath();
        canvasCtx?.moveTo(adjustedWidth, x1);
        canvasCtx?.lineTo(x2, x1);
        canvasCtx?.stroke();
      }
    },
    [gridSize]
  );

  const canvasSetup = useCallback(() => {
    const canvasCtx = canvas.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    canvas.current!.height = window.innerHeight;
    canvas.current!.width = window.innerWidth;
    const width = canvas.current!.width - (canvas.current!.width % gridSize);
    const height = canvas.current!.height - (canvas.current!.height % gridSize);
    const ratio = { x: width / gridSize, y: height / gridSize };
    const adjustedHeight = (canvas.current!.height - height) / 2;
    const adjustedWidth = (canvas.current!.width - width) / 2;

    canvasCtx!.fillStyle = "#fff";
    canvasCtx?.fillRect(adjustedWidth, adjustedHeight, width, height);
    if (snake) snake!.showCanvas(canvasCtx, adjustedWidth, adjustedHeight);
    if (showGrid) drawGrid(canvasCtx, width, height, ratio);
  }, [gridSize, showGrid, drawGrid]);

  useEffect(() => {
    document.title = "Play Snake";
    canvasSetup();
    window.addEventListener("keydown", moveHandler);
  }, [gridSize, canvasSetup]);

  const onChangeGridSlider = (val: number) => {
    const size = Math.abs(val) * 10;
    setGridSize(size);
    setConfig({ ...config, gridSize: size });
  };

  const onChangeSpeedSlider = (val: number) => {
    setSpeed(Math.abs(val));
  };

  const start = (snakeSpeed: number) => {
    loop = setInterval(() => {
      const canvasCtx = canvas.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const width = canvas.current!.width - (canvas.current!.width % gridSize);
      const height =
        canvas.current!.height - (canvas.current!.height % gridSize);
      const ratio = { x: width / gridSize, y: height / gridSize };
      const adjustedHeight = (canvas.current!.height - height) / 2;
      const adjustedWidth = (canvas.current!.width - width) / 2;
      const element = scoreElement.current;
      const score = snake!.getScore();
      snake!.showCanvas(canvasCtx, adjustedWidth, adjustedHeight);
      snake!.move(canvasCtx, adjustedWidth, adjustedHeight);
      if (element) element.innerHTML = `${score}`;
      if (showGrid) drawGrid(canvasCtx, width, height, ratio);
      if (snake!.isDead()) clearInterval(loop);
      if (increment && snakeSpeed > 50) {
        if (score >= 0 && score % 10 === 0) {
          clearInterval(loop);
          start(100 - score);
        }
      }
    }, snakeSpeed);
  };

  const snakeInit = () => {
    const width = canvas.current!.width - (canvas.current!.width % gridSize);
    const height = canvas.current!.height - (canvas.current!.height % gridSize);
    setConfig({
      ...config,
      displaySize: {
        x: width,
        y: height,
      },
    });
    snake = new Snake({
      ...config,
      displaySize: {
        x: width,
        y: height,
      },
    });
  };

  const playHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(true);
    setPause(false);
    if (snake === undefined) snakeInit();
    start(speed);
  };

  const pauseHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(false);
    setPause(true);
    clearInterval(loop);
  };

  const stopHandler = () => {
    document.querySelector(".menu-container")?.classList.toggle("hide");
    setPlay(false);
    setPause(false);
    canvasSetup();
    clearInterval(loop);
    snake = undefined;
  };

  return (
    <>
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
                Score :{" "}
                <span ref={scoreElement}>{snake ? snake!.getScore() : 0}</span>
              </h2>
            </>
          ) : (
            ""
          )}
        </div>

        <canvas id="playfield" ref={canvas} color="white"></canvas>
        <div className="menu-container">
          <div className="back">
            <Link to="/snake-neat">
              <i className="fa fa-arrow-left"></i>
            </Link>
          </div>
          <div>
            <div>
              <h2 className="sub-title">Play Snake Game</h2>
            </div>
            <div className="config">
              <div className="togglers">
                <Switch
                  disabled={pause}
                  value={config.borderWalls}
                  label="Snake dies when it hits a wall."
                  onToggle={() => {
                    const newConfig = {
                      ...config,
                      borderWalls: !config.borderWalls,
                    };
                    setConfig(newConfig);
                    // snake!.setConfig(newConfig);
                  }}
                />

                <Switch
                  disabled={pause}
                  value={config.canEatSelf}
                  label="Snake dies when it his itself."
                  onToggle={() => {
                    const newConfig = {
                      ...config,
                      canEatSelf: !config.canEatSelf,
                    };
                    setConfig(newConfig);
                    // snake.setConfig(newConfig);
                  }}
                />

                <Switch
                  disabled={pause}
                  value={config.growWhenEating}
                  label="Snake grows longer when it eats."
                  onToggle={() => {
                    const newConfig = {
                      ...config,
                      growWhenEating: !config.growWhenEating,
                    };
                    setConfig(newConfig);
                    // snake.setConfig(newConfig);
                  }}
                />

                <Switch
                  value={showGrid}
                  label="Show grid lines."
                  onToggle={() => {
                    setShowGrid(!showGrid);
                  }}
                />

                <Switch
                  value={increment}
                  label="Auto increment snake speed."
                  onToggle={() => {
                    setIncrement(!increment);
                  }}
                />
              </div>
              <div className="sliders">
                <Slider
                  disabled={pause}
                  value={-5}
                  max={-1}
                  min={-5}
                  name="Grid Scale"
                  description="Size of each Snake's grid environment (* 10px)."
                  onChangeEvent={onChangeGridSlider}
                />
                <Slider
                  disabled={pause}
                  value={-100}
                  max={-10}
                  min={-100}
                  step={10}
                  name="Snake Speed"
                  description="Snake speed in milliseconds."
                  onChangeEvent={onChangeSpeedSlider}
                />
              </div>
              <div className="play-button">
                <button className="btn btn-primary play" onClick={playHandler}>
                  {pause ? "Resume" : "Play"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
