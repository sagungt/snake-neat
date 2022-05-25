import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ISnakeConfig } from "./interfaces";
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import Select from "./components/Select";
import Snake from "./snake/TestSnake";

let snake: Snake | undefined;
let loop: NodeJS.Timer;
const versions = [
  {
    value: 1,
    description: "V1",
    recommended: false,
  },
  {
    value: 2,
    description: "V2 (faster)",
    recommended: true,
  },
];
const heuristics = [
  {
    value: "euclidean",
    description: "Euclidean",
    recommended: true,
  },
  {
    value: "manhattan",
    description: "Manhattan",
    recommended: false,
  },
];

export default function AutoAstar() {
  const [config, setConfig] = useState<ISnakeConfig>({
    displaySize: {
      x: window.innerWidth,
      y: window.innerHeight,
    },
    heuristic: "euclidean",
    initialSnakeLength: 1,
    growWhenEating: true,
    borderWalls: true,
    canEatSelf: true,
    gridSize: 10 * 5,
    astarVersion: 2,
  });
  const canvas = useRef<HTMLCanvasElement>(null);
  const scoreElement = useRef<HTMLSpanElement>(null);
  const menuContainer = useRef<HTMLDivElement>(null);
  const [increment, setIncrement] = useState(false);
  const [gridSize, setGridSize] = useState(10 * 5);
  const [showGrid, setShowGrid] = useState(true);
  const [pause, setPause] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [play, setPlay] = useState(false);

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
    const canvasCtx = canvas.current!.getContext(
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
    // if (snake) snake!.showCanvas(canvasCtx, adjustedWidth, adjustedHeight);
    if (showGrid) drawGrid(canvasCtx, width, height, ratio);
  }, [gridSize, showGrid, drawGrid]);

  useEffect(() => {
    document.title = "Autoplay with A*";
    canvasSetup();
  }, [canvasSetup]);

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
      snake!.findFood();
      snake!.showCanvas(canvasCtx, adjustedWidth, adjustedHeight);
      snake!.move(canvasCtx, adjustedWidth, adjustedHeight);
      // clearInterval(loop);
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
    menuContainer.current?.classList.toggle("hide");
    setPlay(true);
    setPause(false);
    if (snake === undefined) snakeInit();
    start(speed);
  };

  const pauseHandler = () => {
    menuContainer.current?.classList.toggle("hide");
    setPlay(false);
    setPause(true);
    clearInterval(loop);
  };

  const stopHandler = () => {
    menuContainer.current?.classList.toggle("hide");
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
                Score : <span id="score" ref={scoreElement}></span>
              </h2>
            </>
          ) : (
            ""
          )}
        </div>

        <canvas id="playfield" ref={canvas}></canvas>
        <div className="menu-container" ref={menuContainer}>
          <div className="back">
            <Link to="/snake-neat">
              <i className="fa fa-arrow-left"></i>
            </Link>
          </div>
          <div>
            <div>
              <h2 className="sub-title">Play Snake Game with A*</h2>
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

                <Select
                  name="version"
                  label="Version of Astar Algorithm"
                  options={versions}
                  onChangeEvent={(value: any) =>
                    setConfig({ ...config, astarVersion: Number(value) })
                  }
                  disabled={pause}
                />

                <Select
                  name="heuristic"
                  label="Heuristic Distance function"
                  options={heuristics}
                  onChangeEvent={(value: any) =>
                    setConfig({ ...config, heuristic: value })
                  }
                  disabled={pause}
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
                  onChangeEvent={(val: number) => {
                    const size = Math.abs(val) * 10;
                    setGridSize(size);
                    setConfig({ ...config, gridSize: size });
                  }}
                />
                <Slider
                  disabled={pause}
                  value={-100}
                  max={-10}
                  min={-100}
                  step={10}
                  name="Snake Speed"
                  description="Snake speed in milliseconds."
                  onChangeEvent={(val: number) => setSpeed(Math.abs(val))}
                />
              </div>
              <div className="buttons">
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
