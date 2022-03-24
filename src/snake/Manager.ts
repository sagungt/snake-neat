import * as d3 from "d3";
import { calculateQ } from "../helper/Helper";
import Snake from "./TestSnake";
import { IManagerConfig } from "../interfaces";
const neataptic = require("neataptic");

const Neat = neataptic.Neat;
const Methods = neataptic.methods;
const Architect = neataptic.architect;

export default class Manager {
  private neat: any;
  private snakes: any;
  private generationLog: any;
  private generationTimeLog: any;
  private iterationCounter: any;
  private mutationRate: number;
  private inputSize: number;
  private startHiddenSize: number;
  private outputSize: number;
  private started: boolean;
  private paused: boolean;
  private config: IManagerConfig;

  constructor(config: IManagerConfig) {
    this.mutationRate = 0.3;
    this.inputSize = 6;
    this.startHiddenSize = 1;
    this.outputSize = 3;

    this.started = false;
    this.paused = false;
    this.config = config;
  }

  getBestModel() {
    // TODO export model + config
    return this.neat.getFittest().toJSON();
  }

  clearCanvas() {
    for (let i = 0; i < this.config.populationSize; i += 1) {
      const canvas = document.getElementById(
        "snake-canvas-" + i
      ) as HTMLCanvasElement;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.clearRect(
        0,
        0,
        this.config.displaySize.x,
        this.config.displaySize.y
      );
    }
  }

  start() {
    this.snakes = [];
    this.generationLog = [];
    this.generationTimeLog = [];
    this.iterationCounter = 0;

    this.neat = new Neat(this.inputSize, this.outputSize, null, {
      mutations: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN,
      ],
      popsize: this.config.populationSize,
      mutationRate: this.mutationRate,
      elitism: Math.round(
        (this.config.elitismPercent / 100) * this.config.populationSize
      ),
      network: new Architect.Random(
        this.inputSize,
        this.config.hiddenNodes || this.startHiddenSize,
        this.outputSize
      ),
    });

    for (let genome in this.neat.population) {
      genome = this.neat.population[genome];
      this.snakes.push(new Snake(this.config, genome));
    }

    this.started = true;
    this.paused = false;

    setTimeout(() => {
      d3.select("#gen").html("1");
    }, 10);

    this.tick();
  }

  stop() {
    this.started = false;
    this.paused = true;
    this.clearCanvas();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.tick();
  }

  // TODO refactor if necessary
  tick() {
    if (!this.started || this.paused) return;

    let i;
    this.iterationCounter += 1;

    const tSnakes = JSON.parse(JSON.stringify(this.snakes));

    for (i in this.snakes) {
      tSnakes[i].index = i;
    }

    tSnakes.sort((a: Snake, b: Snake) => {
      if (a.firstAttempScore > b.firstAttempScore) return -1;
      if (a.firstAttempScore < b.firstAttempScore) return 1;
      return 0;
    });

    let hasEveryoneDied = true;
    let areAllAliveSnakesNegative = true;

    for (i in this.snakes) {
      if (this.snakes[i].deaths === 0) {
        hasEveryoneDied = false;
        if (this.snakes[i].currentScore > 0) {
          areAllAliveSnakesNegative = false;
        }
      }
    }

    if (!hasEveryoneDied) {
      if (this.iterationCounter > 10 && areAllAliveSnakesNegative) {
        hasEveryoneDied = true;
      }
    }

    if (hasEveryoneDied) {
      const newLog = [];

      for (i in tSnakes) {
        let top = false;
        const canvas = document.getElementById(
          "snake-canvas-" + tSnakes[i].index
        ) as HTMLCanvasElement;
        if (
          parseInt(i, 10) <
          (this.config.populationSize * this.config.elitismPercent) / 100
        ) {
          this.snakes[tSnakes[i].index].bragCanvas(canvas.getContext("2d"));
          top = true;
        } else {
          this.snakes[tSnakes[i].index].hideCanvas(canvas.getContext("2d"));
        }

        newLog.push({
          score: tSnakes[i].firstAttempScore,
          generation: this.generationLog.length,
          top,
        });
      }

      this.generationLog.push(newLog);
      this.generationTimeLog.push({
        index: this.generationTimeLog.length,
      });

      if (this.config.showGraphLog) this.drawGraph();

      setTimeout(() => {
        this.breed();
      }, 1000);
    } else {
      setTimeout(() => {
        for (i in this.snakes) {
          this.snakes[i].look();
          const canvas = document.getElementById(
            "snake-canvas-" + i
          ) as HTMLCanvasElement;
          const context = canvas.getContext("2d");
          this.snakes[i].showCanvas(context);
          this.snakes[i].moveWithPredict(context);
        }

        this.tick();
      }, 1);
    }
  }

  // TODO refactor if necessary
  breed() {
    this.neat.sort();
    const newPopulation = [];
    let i;

    for (i = 0; i < this.neat.elitism; i += 1) {
      newPopulation.push(this.neat.population[i]);
    }

    for (i = 0; i < this.neat.popsize - this.neat.elitism; i += 1) {
      newPopulation.push(this.neat.getOffspring());
    }

    this.neat.population = newPopulation;
    this.neat.mutate();

    this.neat.generation += 1;
    d3.select("#gen").html(this.neat.generation + 1);

    this.snakes = [];

    for (let genome in this.neat.population) {
      genome = this.neat.population[genome];
      this.snakes.push(new Snake(this.config, genome));
    }

    this.iterationCounter = 0;

    this.tick();
  }

  updateSettings(newConfig: IManagerConfig) {
    this.config = newConfig;
    for (let i in this.snakes) {
      this.snakes[i].config = this.config;
    }
  }

  drawGraph() {
    d3.select("#graph").selectAll("svg").remove();

    const canvas = document.getElementById("graph") as HTMLCanvasElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const pad = {
      left: 35,
      right: 0,
      top: 2,
      bottom: 20,
    };

    const xMax =
      this.generationLog.length - 1 > 10 ? this.generationLog.length : 10;

    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([pad.left + 10, width + pad.right - 10])
      .nice();

    const minScore: any =
      d3.min(this.generationLog, (d: any) => {
        return d3.min(d, (e: any) => {
          return e.score;
        });
      }) || -10;
    const maxScore: any =
      d3.max(this.generationLog, (d: any) => {
        return d3.max(d, (e: any) => {
          return e.score;
        });
      }) || 10;

    const yScale = d3
      .scaleLinear()
      .domain([minScore, maxScore])
      .range([height - pad.bottom - 10, pad.top + 10])
      .nice();

    if (yScale(0) > pad.top && yScale(0) < height - pad.bottom) {
      svg
        .append("line")
        .attr("x1", pad.left - 6)
        .attr("y1", yScale(0) + 0.5)
        .attr("x2", width - pad.right)
        .attr("y2", yScale(0) + 0.5)
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .style("shape-rendering", "crispEdges");
    }

    const genSvg = svg
      .selectAll("generation")
      .data(this.generationLog)
      .enter()
      .append("g");

    const netSvg = genSvg
      .selectAll("net")
      .data((d: any) => {
        return d;
      })
      .enter();

    netSvg
      .append("circle")
      .attr("cx", (d: any) => xScale(d.generation))
      .attr("cy", (d: any) => yScale(d.score))
      .attr("opacity", (d: any) => {
        if (d.top) return 0.8;
        return 0.25;
      })
      .attr("r", 2.5)
      .attr("fill", (d: any) => {
        if (d.top) return "#3aa3e3";
        return "#000";
      });

    const medianLine: any = [];
    const q1Line: any = [];
    const q3Line: any = [];

    for (let i in this.generationLog) {
      medianLine.push({
        score: calculateQ(this.generationLog[i], 0.5),
        generation: parseInt(i, 10),
      });
      q1Line.push({
        score: calculateQ(this.generationLog[i], 0.25),
        generation: parseInt(i, 10),
      });
      q3Line.push({
        score: calculateQ(this.generationLog[i], 0.75),
        generation: parseInt(i, 10),
      });
    }

    const lineFunction = d3
      .line()
      .x((d: any) => xScale(d.generation))
      .y((d: any) => yScale(d.score))
      .curve(d3.curveCardinal);

    svg
      .append("path")
      .attr("d", lineFunction(medianLine))
      .attr("stroke", "#000")
      .attr("stroke-width", 4)
      .attr("fill", "none")
      .attr("opacity", 0.25);

    svg
      .append("path")
      .attr("d", lineFunction(q1Line))
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("fill", "none")
      .attr("opacity", 0.25);

    svg
      .append("path")
      .attr("d", lineFunction(q3Line))
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("fill", "none")
      .attr("opacity", 0.25);

    svg
      .append("g")
      .attr("transform", "translate(0," + (height - pad.bottom) + ")")
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", "translate(" + pad.left + ",0)")
      .call(d3.axisLeft(yScale));

    svg.selectAll(".domain").attr("opacity", 0);

    svg.selectAll(".tick").selectAll("line").attr("opacity", 0.5);
  }
}
