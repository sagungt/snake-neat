import { IManagerConfig } from "./interfaces";
import { useState, useEffect } from "react";
import Slider from "./components/Slider";
import Switch from "./components/Switch";
import { Link } from "react-router-dom";
import Field from "./components/Field";
import Manager from "./snake/Manager";
import "./styles/factory.css";
import { setStorageValue } from "./helper/Helper";

let manager: Manager;

export default function Factory() {
  const [config, setConfig] = useState<IManagerConfig>({
    displaySize: {
      x: 100,
      y: 100,
    },
    initialSnakeLength: 4,
    growWhenEating: true,
    moveAwayScore: -1.5,
    moveTowardsScore: 1,
    showGraphLog: false,
    populationSize: 50,
    elitismPercent: 10,
    borderWalls: true,
    canEatSelf: true,
    hiddenNodes: 1,
    foodScore: 10,
    gridSize: 5,
  });
  const [running, setRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  const start = () => {
    setRunning(true);
    manager = new Manager(config);
    manager.start();
  };

  const stop = () => {
    setRunning(false);
    setPaused(false);
    manager.stop();
  };

  const pause = () => {
    setPaused(true);
    manager.pause();
  };

  const resume = () => {
    setPaused(false);
    setRunning(true);
    manager.resume();
  };

  const getBestModel = () => {
    const date = new Date();
    const bestModel = manager.getBestModel();
    setStorageValue(`Model-${date.getTime()}`, bestModel);
    alert("Model Saved in localStorage : Model-" + date.getTime());
  };

  const menuToggler = () => {
    document.querySelector(".toggler")?.classList.toggle("toggler-hide");
    document
      .querySelector(".control-menu")
      ?.classList.toggle("control-menu-hide");
  };

  const toggleGraph = () => {
    const newConfig = { ...config, showGraphLog: !config.showGraphLog };
    document.querySelector(".graph")?.classList.toggle("graph-hide");
    setConfig(newConfig);
    if (manager) manager.updateSettings(newConfig);
  };

  useEffect(() => {
    document.title = "Snake Factory";
  });

  return (
    <>
      <div className="App">
        <div className="control-menu">
          <Link to={"/snake-neat"} className="btn btn-primary">
            Go to Menu
          </Link>
          {running && !paused ? (
            <>
              <div className="btn btn-orange" onClick={pause}>
                Pause Evolution
              </div>
            </>
          ) : (
            ""
          )}
          {running && paused ? (
            <>
              <div className="btn btn-success" onClick={resume}>
                Resume Evolution
              </div>
              <div className="btn btn-danger" onClick={stop}>
                Stop Evolution
              </div>
              <div className="btn btn-primary" onClick={getBestModel}>
                Save Config + Model
              </div>
            </>
          ) : (
            ""
          )}

          {!running ? (
            <div className="btn btn-success" onClick={start}>
              Start Evolution
            </div>
          ) : (
            ""
          )}

          <Slider
            disabled={running}
            min={1}
            max={20}
            required={true}
            value={1}
            name="Hidden Nodes"
            description="Amount of nodes inbetween input and output."
            onChangeEvent={(val: number) => {
              const newConfig = { ...config, hiddenNodes: val };
              setConfig(newConfig);
              // if (manager) manager.updateSettings(newConfig)
            }}
          />

          <Field
            type="number"
            name="populationSize"
            placeholder="Population Size"
            required={true}
            value={config.populationSize}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, populationSize: v || 2 });
              // if (manager) manager.updateSettings(config);
            }}
            disabled={running}
            description="How many neural nets per generation?"
            min={2}
          />

          <Field
            type="number"
            name="elitismPercent"
            placeholder="Elitism Percent"
            required={true}
            value={config.elitismPercent}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, elitismPercent: v || 10 });
              // if (manager) manager.updateSettings(config);
            }}
            disabled={running}
            description="% of top performers to use for the next generation."
            min={1}
            max={100}
            step={1}
          />

          <Field
            type="number"
            name="foodScore"
            placeholder="Eat Food Score"
            required={true}
            value={config.foodScore}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, foodScore: v || 10 });
              if (manager) manager.updateSettings(config);
            }}
            description="Awarded for eating food."
            step={1}
          />

          <Field
            type="number"
            name="moveTowardsScore"
            placeholder="Move Towards Food Score"
            required={true}
            value={config.moveTowardsScore}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, moveAwayScore: v || 1 });
              if (manager) manager.updateSettings(config);
            }}
            description="Awarded for each step towards food."
            step={0.5}
          />

          <Field
            type="number"
            name="moveAwayScore"
            placeholder="Move Away Food Score"
            required={true}
            value={config.moveAwayScore}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, moveAwayScore: v || -1.5 });
              if (manager) manager.updateSettings(config);
            }}
            description="Awarded for each step away from food."
            step={0.5}
          />

          <Field
            type="number"
            name="initialSnakeLength"
            placeholder="Snake Starting Length"
            required={true}
            value={config.initialSnakeLength}
            onChangeEvent={(v: number) => {
              setConfig({ ...config, initialSnakeLength: v || 1 });
              if (manager) manager.updateSettings(config);
            }}
            description="Measured in grid cells."
            min={1}
            step={1}
            max={Math.floor(config.gridSize * 2)}
          />

          <Field
            disabled={running}
            type="number"
            name="gridSize"
            placeholder="Grid Size (in px)"
            required={true}
            value={config.gridSize}
            onChangeEvent={(v: number) => {
              setConfig({
                ...config,
                gridSize: v || 1,
                displaySize: { x: v * 20, y: v * 20 },
              });
              if (manager) manager.updateSettings(config);
            }}
            description="Size of each Snake's grid environment."
            min={1}
            step={1}
          />

          <Field
            disabled={running}
            type="number"
            name="displaySize"
            placeholder="Display Size (in px)"
            required={true}
            value={config.displaySize.x}
            onChangeEvent={(v: number) => {
              if (v % config.gridSize === 0) {
                setConfig({
                  ...config,
                  displaySize: { x: v || 10, y: v || 10 },
                });
                if (manager) manager.updateSettings(config);
              }
            }}
            description="Each field size. Doesn't affect gameplay."
            min={10}
            step={config.gridSize}
          />

          <Switch
            value={config.borderWalls}
            disabled={running}
            label="Snake dies when it hits a wall."
            onToggle={() => {
              const newConfig = { ...config, borderWalls: !config.borderWalls };
              setConfig(newConfig);
              if (manager) manager.updateSettings(newConfig);
            }}
          />

          <Switch
            value={config.canEatSelf}
            disabled={running}
            label="Snake dies when it his itself."
            onToggle={() => {
              const newConfig = { ...config, canEatSelf: !config.canEatSelf };
              setConfig(newConfig);
              if (manager) manager.updateSettings(newConfig);
            }}
          />

          <Switch
            value={config.growWhenEating}
            disabled={running}
            label="Snake grows longer when it eats."
            onToggle={() => {
              const newConfig = {
                ...config,
                growWhenEating: !config.growWhenEating,
              };
              setConfig(newConfig);
              if (manager) manager.updateSettings(newConfig);
            }}
          />

          <Switch
            value={config.showGraphLog}
            label="Show performance."
            onToggle={toggleGraph}
          />
        </div>
        <div className="toggler" onClick={menuToggler}>
          &#9776;
        </div>
        <div className="workspace">
          <div className="description">
            <h3 style={{ marginBottom: 10, marginTop: 0 }}>
              {running ? (
                <span>
                  Generation <span id="gen"></span>{" "}
                  <small>
                    <i>
                      (Training process is client side, it may slowing down your
                      device)
                    </i>
                  </small>
                </span>
              ) : (
                <span>Designing AI: Solving Snake with Evolution</span>
              )}
            </h3>
          </div>
          <div id="workspace">
            {Array(config.populationSize || 10)
              .fill(null)
              .map((_, i) => {
                return (
                  <div className="grid-item" key={i}>
                    <canvas
                      id={"snake-canvas-" + i}
                      width={config.displaySize.x + "px"}
                      height={config.displaySize.y + "px"}
                    ></canvas>
                  </div>
                );
              })}
          </div>
          <div className="graph graph-hide">
            <hr />
            <h3 style={{ marginBottom: 10 }}>Performance by Generation</h3>
            <div id="graph">{/* graph will load here */}</div>
            <p>
              This graph shows a dot for every individual neural net's
              performance. Each new generation will appear at to the right.
            </p>
            <p>
              <small>
                <strong>Be patient.</strong> Sometimes, advantageous random
                mutations happen quickly, sometimes those mutations prove it's
                better to play it safe, and sometimes they never seem to
                happen...
              </small>
            </p>
            <small>
              <i>
                <strong>
                  Warning: Some browsers slow down the loops being used to train
                  the AI if this tab is in the background. Funky things may
                  happen.
                </strong>
              </i>
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
