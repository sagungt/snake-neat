import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getStorageValue, listStorage } from "./helper/Helper";
import { ISnakeConfig } from "./interfaces";
import Select from "./components/Select";
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import { models } from "./snake/models";
import Snake from "./snake/TestSnake";
const neataptic = require("neataptic");

let snake: Snake | undefined;
let loop: NodeJS.Timer;

const savedModels = listStorage();
const preTrainedModels = models.map((model: any) => {
  return {
    value: JSON.stringify(model.value),
    recommended: model.recommended,
    description: model.description,
  };
});
let currentModel: any = JSON.parse(preTrainedModels[0].value).model;

export default function AutoAI() {
  const [config, setConfig] = useState<ISnakeConfig>({
    displaySize: {
      x: window.innerWidth,
      y: window.innerHeight,
    },
    initialSnakeLength: 1,
    growWhenEating: true,
    borderWalls: true,
    canEatSelf: true,
    gridSize: 10 * 5,
  });
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const [gridSize, setGridSize] = useState(10 * 5);
  const [showGrid, setShowGrid] = useState(true);
  const [increment, setIncrement] = useState(false);
  const [speed, setSpeed] = useState(100);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scoreElement = useRef<HTMLSpanElement>(null);
  const menuContainer = useRef<HTMLDivElement>(null);

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
  }, [drawGrid, gridSize, showGrid]);

  useEffect(() => {
    document.title = "Autoplay with AI";
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
      snake!.look();
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
    clearInterval(loop);
    snake = undefined;
  };

  const snakeInit = () => {
    const network = neataptic.Network.fromJSON(currentModel);
    const width = canvas.current!.width - (canvas.current!.width % gridSize);
    const height = canvas.current!.height - (canvas.current!.height % gridSize);

    setConfig({
      ...config,
      displaySize: {
        x: width,
        y: height,
      },
    });
    snake = new Snake(
      {
        ...config,
        displaySize: {
          x: width,
          y: height,
        },
      },
      network
    );
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
              <h2 className="sub-title">Play Snake Game with AI</h2>
            </div>
            <div className="select-list">
              <Select
                style={{ width: "70%" }}
                name="model-list"
                label="Select model of AI"
                onChangeEvent={(value: any) => {
                  if (value.startsWith("Model")) {
                    const model = JSON.parse(getStorageValue(value));
                    setConfig({
                      ...config,
                      growWhenEating: model.config.growWhenEating,
                      borderWalls: model.config.borderWalls,
                      canEatSelf: model.config.canEatSelf,
                    });
                    currentModel = model.model;
                  } else {
                    const model = JSON.parse(value);
                    setConfig({
                      ...config,
                      growWhenEating: model.config.growWhenEating,
                      borderWalls: model.config.borderWalls,
                      canEatSelf: model.config.canEatSelf,
                    });
                    currentModel = model.model;
                  }
                }}
                options={[...preTrainedModels, ...savedModels]}
                disabled={pause}
              />
            </div>
            <div className="config">
              <div className="togglers">
                <Switch
                  disabled={true}
                  value={config.borderWalls}
                  label="Snake dies when it hits a wall."
                  onToggle={() => {}}
                />

                <Switch
                  disabled={true}
                  value={config.canEatSelf}
                  label="Snake dies when it his itself."
                  onToggle={() => {}}
                />

                <Switch
                  disabled={true}
                  value={config.growWhenEating}
                  label="Snake grows longer when it eats."
                  onToggle={() => {}}
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
                  onChangeEvent={(val: number) => {
                    setSpeed(Math.abs(val));
                  }}
                />
              </div>
              <div className="buttons">
                <button className="btn btn-primary play" onClick={playHandler}>
                  {pause ? "Resume" : "Play"}
                </button>
                {!pause && (
                  <Link
                    to={"/snake-neat/train"}
                    className="btn btn-primary"
                    style={{
                      height: "2.4em",
                      verticalAlign: "middle",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "3.6em",
                    }}
                  >
                    Train
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
