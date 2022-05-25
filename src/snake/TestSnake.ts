import {
  radiansToDegrees,
  angleToPoint,
  arrayIsEqual,
  distance,
  zeros,
} from "../helper/Helper";
import { ICoordinate, ISnakeConfig } from "../interfaces";
import Astar from "./Astar";
import AstarV2 from "./AstarV2";
import { Grid } from "./Grid";

export default class Snake {
  private pathToFood: Array<ICoordinate>;
  public firstAttemptScore: number;
  private config: ISnakeConfig;
  private currentScore: number;
  private gamesPlayed: number;
  private ratio: ICoordinate;
  private direction: number;
  private turnAngle: number;
  private lastDistance: any;
  private bestScore: number;
  private deaths: number;
  private dead: boolean;
  private theta: string;
  private score: number;
  private checks: any;
  private key: string;
  private grid!: Grid;
  private brain: any;
  private state: any;
  private data: any;

  constructor(config: ISnakeConfig, genome?: any) {
    this.lastDistance = config.displaySize.x / config.gridSize;
    this.ratio = {
      x: config.displaySize.x / config.gridSize,
      y: config.displaySize.y / config.gridSize,
    };
    if (config.astarVersion === 2) {
      this.grid = new Grid(zeros([this.ratio.x, this.ratio.y], 1));
    }
    if (this.brain) this.brain.score = 0;
    this.brain = genome || null;
    this.firstAttemptScore = 0;
    this.key = "straight";
    this.currentScore = 0;
    this.gamesPlayed = -1;
    this.config = config;
    this.pathToFood = [];
    this.direction = 270;
    this.turnAngle = 90;
    this.bestScore = 0;
    this.checks = null;
    this.dead = false;
    this.state = {};
    this.deaths = 0;
    this.theta = "";
    this.score = 0;
    this.restart();
    this.makeFood();
  }

  getDeaths(): number {
    return this.deaths;
  }

  getCurrentScore(): number {
    return this.currentScore;
  }

  getFirstAttemptScore(): number {
    return this.firstAttemptScore;
  }

  getBody() {
    return this.state.body;
  }

  setConfig(config: ISnakeConfig) {
    this.config = config;
  }

  getDirection(): number {
    return this.direction;
  }

  setDirection(val: number) {
    this.direction = val;
  }

  getScore(): number {
    return this.score;
  }

  isDead(): boolean {
    return this.deaths > 0;
  }

  look() {
    if (this.dead) return;

    const a = angleToPoint({
      x1: this.state.body[0].x,
      y1: this.state.body[0].y,
      x2: this.state.food.x,
      y2: this.state.food.y,
    });

    const d = radiansToDegrees(a);
    let theta = d + 90;

    if (theta > 180) theta -= 360;
    theta += this.direction;

    if (theta > 180) theta -= 360;
    this.theta = theta.toFixed(2);
    theta /= 180;

    let data = [];
    if (theta > -0.25 && theta < 0.25) {
      data = [0, 1, 0];
    } else if (theta <= -0.25) {
      data = [1, 0, 0];
    } else {
      data = [0, 0, 1];
    }

    const head = JSON.parse(JSON.stringify(this.state.body[0]));
    this.checks = [];

    if (this.direction === 0) {
      this.checks = [
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
      ];
    } else if (this.direction === 90) {
      this.checks = [
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
      ];
    } else if (this.direction === 270) {
      this.checks = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];
    } else if (this.direction === 180) {
      this.checks = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ];
    }

    for (const check of this.checks) {
      const tx = check.x + head.x;
      const ty = check.y + head.y;

      if (tx < 0 || tx >= this.ratio.x) {
        data.push(1);
        check.hit = true;
        continue;
      }

      if (tx < 0 || ty >= this.ratio.y) {
        data.push(1);
        check.hit = true;
        continue;
      }

      let bodyHit = false;
      for (let body of this.state.body) {
        if (body.x === tx && body.y === ty) {
          bodyHit = true;
          break;
        }
      }

      if (bodyHit) {
        data.push(1);
        check.hit = true;
        continue;
      }
      check.hit = false;
      data.push(0);
    }

    this.data = data;
  }

  restart() {
    const body = [];
    const rows = [];

    for (let x = 0; x < this.ratio.x; x += 1) {
      const d = [];
      for (let y = 0; y < this.ratio.y; y += 1) {
        d.push({ x, y });
      }
      rows.push(d);
    }

    body.push({
      x: parseInt(`${this.ratio.x / 2}`, 10),
      y: parseInt(`${this.ratio.y / 2}`, 10),
    });

    for (let i = 1; i < this.config.initialSnakeLength; i += 1) {
      body.push({
        x: parseInt(`${this.ratio.x / 2}`, 10) - i,
        y: parseInt(`${this.ratio.y / 2}`, 10),
      });
    }

    this.state = {
      rows,
      body,
      food: { x: -1, y: -1 },
    };

    this.currentScore = 0;
    this.direction = 270;
    this.gamesPlayed += 1;
    this.lastDistance = this.config.displaySize.x / this.config.gridSize;
  }

  makeFood() {
    let food = undefined;

    while (food === undefined) {
      const tfood = {
        x: parseInt(`${this.ratio.x * Math.random()}`, 10),
        y: parseInt(`${this.ratio.y * Math.random()}`, 10),
      };
      let found = false;
      for (const body of this.state.body) {
        if (body.x === tfood.x && body.y === tfood.y) {
          found = true;
          break;
        }
      }

      if (!found) food = tfood;
    }

    this.state.food = food;
  }

  hideCanvas(context: CanvasRenderingContext2D) {
    context.fillStyle = "rgba(255,255,255,.75)";
    context.fillRect(
      0,
      0,
      this.config.displaySize.x,
      this.config.displaySize.y
    );
  }

  showCanvas(
    context: CanvasRenderingContext2D,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    context.clearRect(
      offsetX - 1,
      offsetY - 1,
      this.config.displaySize.x + 1,
      this.config.displaySize.y + 1
    );

    context.fillStyle = "#000";
    if (this.deaths > 0) context.fillStyle = "#bbb";

    const indexedBody = this.state.body.map((body: any, index: number) => [
      index,
      body,
    ]);
    const bodyLength = this.state.body.length;
    for (const [index, body] of indexedBody) {
      context.globalAlpha = (bodyLength - index) / bodyLength / 2 + 0.5;

      context.fillRect(
        body.x * this.config.gridSize + offsetX,
        body.y * this.config.gridSize + offsetY,
        this.config.gridSize,
        this.config.gridSize
      );
    }

    for (const next of this.pathToFood) {
      context.fillStyle = "#ccc";

      context.fillRect(
        next.x * this.config.gridSize + offsetX,
        next.y * this.config.gridSize + offsetY,
        this.config.gridSize,
        this.config.gridSize
      );
    }

    context.globalAlpha = 1;
    context.fillStyle = "#2c4";
    context.beginPath();
    context.arc(
      (this.state.food.x + 0.5) * this.config.gridSize + offsetX,
      (this.state.food.y + 0.5) * this.config.gridSize + offsetY,
      this.config.gridSize / 2,
      0,
      2 * Math.PI
    );

    context.fill();
  }

  bragCanvas(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#3aa3e3";
    context.lineWidth = 4;
    context.strokeRect(
      0,
      0,
      this.config.displaySize.x,
      this.config.displaySize.y
    );
  }

  move(
    context: CanvasRenderingContext2D,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    const head = JSON.parse(JSON.stringify(this.state.body[0]));
    if (this.pathToFood.length) {
      const next = JSON.parse(JSON.stringify(this.pathToFood[0]));
      const direction = [next.x - head.x, next.y - head.y];

      this.pathToFood.splice(0, 1);
      if (arrayIsEqual(direction, [0, -1])) this.direction = 0;
      if (arrayIsEqual(direction, [-1, 0])) this.direction = 90;
      if (arrayIsEqual(direction, [0, 1])) this.direction = 180;
      if (arrayIsEqual(direction, [1, 0])) this.direction = 270;
    }
    if (this.brain) {
      const moveOdds = this.brain.activate(this.data);
      const max = moveOdds.indexOf(Math.max(...moveOdds));

      switch (max) {
        case 0:
          this.key = "left";
          this.direction += this.turnAngle;
          break;
        case 1:
          this.key = "straight";
          break;
        case 2:
          this.key = "right";
          this.direction -= this.turnAngle;
          break;
        default:
          break;
      }

      if (this.direction < 0) this.direction += 360;
      this.direction = this.direction % 360;
    }

    if (this.direction === 0) {
      head.y -= 1;
    } else if (this.direction === 90) {
      head.x -= 1;
    } else if (this.direction === 180) {
      head.y += 1;
    } else if (this.direction === 270) {
      head.x += 1;
    }

    let died = false;
    if (this.config.borderWalls) {
      if (head.x < 0 || head.x >= this.ratio.x) {
        died = true;
      }
      if (head.y < 0 || head.y >= this.ratio.y) {
        died = true;
      }
    } else {
      if (head.x < 0) head.x = this.ratio.x - 1;
      if (head.x >= this.ratio.x) head.x = 0;
      if (head.y < 0) head.y = this.ratio.y - 1;
      if (head.y >= this.ratio.y) head.y = 0;
    }

    if (this.state.body.length > 1 && this.config.canEatSelf) {
      const bodyLength = this.state.body.length;
      for (let i = 2; i < bodyLength; i += 1) {
        if (
          head.x === this.state.body[i].x &&
          head.y === this.state.body[i].y
        ) {
          died = true;
          break;
        }
      }
    }

    let eating = false;
    if (!died) {
      if (head.x === this.state.food.x && head.y === this.state.food.y) {
        eating = true;
      }

      this.state.body.unshift(head);
      if (!eating || !this.config.growWhenEating) {
        this.state.body.splice(this.state.body.length - 1, 1);
      }
    }

    if (died) {
      context.clearRect(
        offsetX,
        offsetY,
        this.config.displaySize.x,
        this.config.displaySize.y
      );
      context.fillStyle = "rgba(255,0,0,.5)";

      for (const body of this.state.body) {
        context.fillRect(
          body.x * this.config.gridSize + offsetX,
          body.y * this.config.gridSize + offsetY,
          this.config.gridSize,
          this.config.gridSize
        );
      }

      context.globalAlpha = 1;
      context.fillStyle = "#2c4";
      context.beginPath();
      context.arc(
        (this.state.food.x + 0.5) * this.config.gridSize + offsetX,
        (this.state.food.y + 0.5) * this.config.gridSize + offsetY,
        this.config.gridSize / 2,
        0,
        2 * Math.PI
      );

      context.fill();

      this.deaths += 1;
      return;
    }

    if (eating) {
      this.makeFood();
      this.score += 1;
    }
  }

  moveWithPredict(context: CanvasRenderingContext2D) {
    const head = JSON.parse(JSON.stringify(this.state.body[0]));
    const moveOdds = this.brain.activate(this.data);
    const max = moveOdds.indexOf(Math.max(...moveOdds));

    switch (max) {
      case 0:
        this.key = "left";
        this.direction += this.turnAngle;
        break;
      case 1:
        this.key = "straight";
        break;
      case 2:
        this.key = "right";
        this.direction -= this.turnAngle;
        break;
      default:
        break;
    }

    if (this.direction < 0) this.direction += 360;
    this.direction = this.direction % 360;

    if (this.direction === 0) {
      head.y -= 1;
    } else if (this.direction === 90) {
      head.x -= 1;
    } else if (this.direction === 180) {
      head.y += 1;
    } else if (this.direction === 270) {
      head.x += 1;
    }

    let died = false;
    if (this.config.borderWalls) {
      if (head.x < 0 || head.x >= this.ratio.x) {
        died = true;
      }
      if (head.y < 0 || head.y >= this.ratio.y) {
        died = true;
      }
    } else {
      if (head.x < 0) head.x = this.ratio.x - 1;
      if (head.x >= this.ratio.x) head.x = 0;
      if (head.y < 0) head.y = this.ratio.y - 1;
      if (head.y >= this.ratio.y) head.y = 0;
    }

    if (this.state.body.length > 1 && this.config.canEatSelf) {
      const bodyLength = this.state.body.length;
      for (let i = 2; i < bodyLength; i += 1) {
        if (
          head.x === this.state.body[i].x &&
          head.y === this.state.body[i].y
        ) {
          died = true;
          break;
        }
      }
    }

    let eating = false;
    if (!died) {
      if (head.x === this.state.food.x && head.y === this.state.food.y) {
        eating = true;

        this.currentScore += this.config.foodScore;
        this.lastDistance = this.ratio.x * this.config.gridSize * 2;
      }

      this.state.body.unshift(head);
      if (!eating || !this.config.growWhenEating) {
        this.state.body.splice(this.state.body.length - 1, 1);
      }

      const d = distance({
        x1: head.x,
        y1: head.y,
        x2: this.state.food.x,
        y2: this.state.food.y,
      });
      if (d < this.lastDistance) {
        this.currentScore += this.config.moveTowardsScore;
      } else {
        this.currentScore += this.config.moveAwayScore;
      }

      this.lastDistance = d;
    }

    if (this.currentScore > this.brain.score) {
      this.bestScore = this.currentScore;
    }

    if (this.deaths === 0) {
      this.firstAttemptScore = this.currentScore;
      this.brain.score = this.currentScore;
    }

    if (died) {
      context.clearRect(0, 0, 100, 100);
      context.fillStyle = "rgba(255,0,0,.5)";

      for (const body of this.state.body) {
        context.fillRect(
          body.x * this.config.gridSize,
          body.y * this.config.gridSize,
          this.config.gridSize,
          this.config.gridSize
        );
      }

      this.restart();
      this.makeFood();

      this.deaths += 1;
      return;
    }
    if (eating) this.makeFood();
  }

  findFood() {
    if (this.pathToFood.length) return;

    // console.time(`${this.config.astarVersion}: ${this.config.heuristic}`);
    if (this.config.astarVersion === 1) {
      this.pathToFood = Astar({
        grid: this.ratio,
        start: this.state.body[0],
        goal: this.state.food,
        options: {
          body: this.state.body,
          heuristic: this.config.heuristic,
          canEatSelf: this.config.canEatSelf,
        },
      }).slice(1);
    }

    if (this.config.astarVersion === 2) {
      this.pathToFood = AstarV2.search(
        this.grid,
        this.state.body[0],
        this.state.food,
        {
          body: this.state.body,
          heuristic: this.config.heuristic,
          canEatSelf: this.config.canEatSelf,
          closest: true,
        }
      );
    }

    // console.timeEnd(`${this.config.astarVersion}: ${this.config.heuristic}`);
  }
}
