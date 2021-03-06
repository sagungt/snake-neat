import { distance, angleToPoint, radiansToDegrees } from "../helper/Helper";

interface ICoord {
  x: number;
  y: number;
}

interface IConfig {
  growWhenEating: boolean;
  gridResolution: number;
  borderWalls: boolean;
  displaySize: ICoord;
  canEatSelf: boolean;
  initialSnakeLength?: any;
  moveTowardsScore?: any;
  moveAwayScore?: any;
  foodScore?: any;
}

export default class Snake {
  public firstAttempScore: number;
  private currentScore: number;
  private gamesPlayed: number;
  private lastDirection: any;
  private bestScore: number;
  private maxDeaths: number;
  private highScore: number;
  private direction: number;
  private turnAngle: number;
  private lastDistance: any;
  private config: IConfig;
  private deaths: number;
  private dead: boolean;
  private canvas: any;
  private checks: any;
  private key: string;
  private state: any;
  private brain: any;
  private theta: any;
  private data: any;

  constructor(config: IConfig, genome?: any, canvas?: HTMLCanvasElement) {
    this.lastDirection = undefined;
    this.canvas = canvas || null;
    this.brain = genome || null;
    if (this.brain) {
      this.brain.score = 0;
    }
    this.firstAttempScore = 0;
    this.currentScore = 0;
    this.gamesPlayed = -1;
    this.key = "straight";
    this.config = config;
    this.turnAngle = 90;
    this.bestScore = 0;
    this.maxDeaths = 0;
    this.highScore = 0;
    this.direction = 0;
    this.checks = null;
    this.theta = null;
    this.dead = false;
    this.state = {};
    this.deaths = 0;
    this.lastDistance = this.config.gridResolution;
    this.restart();
    this.makeFood();
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

    for (let i in this.checks) {
      const tx = this.checks[i].x + head.x;
      const ty = this.checks[i].y + head.y;

      if (tx < 0 || tx >= this.config.gridResolution) {
        data.push(1);
        this.checks[i].hit = true;
        continue;
      }

      if (tx < 0 || ty >= this.config.gridResolution) {
        data.push(1);
        this.checks[i].hit = true;
        continue;
      }

      let bodyHit = false;
      for (let j in this.state.body) {
        const b = this.state.body[j];
        if (b.x === tx && b.y === ty) {
          bodyHit = true;
          break;
        }
      }

      if (bodyHit) {
        data.push(1);
        this.checks[i].hit = true;
        continue;
      }
      this.checks[i].hit = false;
      data.push(0);
    }

    this.data = data;
  }

  restart() {
    const body = [];
    const rows = [];

    for (let x = 0; x < this.config.gridResolution; x += 1) {
      const d = [];
      for (let y = 0; y < this.config.gridResolution; y += 1) {
        d.push({ x: x, y: y });
      }
      rows.push(d);
    }

    body.push({
      x: parseInt(`${this.config.gridResolution / 2}`, 10),
      y: parseInt(`${this.config.gridResolution / 2}`, 10),
    });

    for (let i = 1; i < this.config.initialSnakeLength; i += 1) {
      body.push({
        x: parseInt(`${this.config.gridResolution / 2}`, 10),
        y: parseInt(`${this.config.gridResolution / 2}`, 10) + i,
      });
    }

    this.state = {
      rows: rows,
      body: body,
      food: { x: -1, y: -1 },
    };

    this.currentScore = 0;
    this.direction = 0;
    this.gamesPlayed += 1;
    this.lastDirection = undefined;
    this.lastDistance = this.config.gridResolution;
  }

  makeFood() {
    let food = undefined;

    while (food === undefined) {
      const tfood = {
        x: parseInt(`${this.config.gridResolution * Math.random()}`, 10),
        y: parseInt(`${this.config.gridResolution * Math.random()}`, 10),
      };
      let found = false;
      for (let i in this.state.body) {
        if (
          this.state.body[i].x === tfood.x &&
          this.state.body[i].y === tfood.y
        ) {
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
    offsetX?: number,
    offsetY?: number
  ) {
    context.clearRect(
      0,
      0,
      this.config.displaySize.x,
      this.config.displaySize.y
    );

    context.fillStyle = "#000";
    if (this.deaths > 0) context.fillStyle = "#bbb";

    for (let i in this.state.body) {
      context.globalAlpha =
        (this.state.body.length - 1) / this.state.body.length / 2 + 0.5;

      const d = this.state.body[i];
      context.fillRect(
        (d.x / this.config.gridResolution) * this.config.displaySize.x +
          (offsetX ? offsetX : 0),
        (d.y / this.config.gridResolution) * this.config.displaySize.y +
          (offsetY ? offsetY : 0),
        this.config.displaySize.x / this.config.gridResolution,
        this.config.displaySize.y / this.config.gridResolution
      );
    }

    context.globalAlpha = 1;
    context.fillStyle = "#2c4";
    context.beginPath();
    context.arc(
      ((this.state.food.x + 0.5) / this.config.gridResolution) *
        this.config.displaySize.x +
        (offsetX ? offsetX : 0),
      ((this.state.food.y + 0.5) / this.config.gridResolution) *
        this.config.displaySize.y +
        (offsetY ? offsetY : 0),
      this.config.displaySize.x / this.config.gridResolution / 2,
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

  moveCanvas(context: CanvasRenderingContext2D) {
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
      if (head.x < 0 || head.x >= this.config.gridResolution) {
        died = true;
      }
      if (head.y < 0 || head.y >= this.config.gridResolution) {
        died = true;
      }
    } else {
      if (head.x < 0) head.x = this.config.gridResolution - 1;
      if (head.x >= this.config.gridResolution) head.x = 0;
      if (head.y < 0) head.y = this.config.gridResolution - 1;
      if (head.y >= this.config.gridResolution) head.y = 0;
    }

    if (this.state.body.length > 1 && this.config.canEatSelf) {
      for (let i = 2; i < this.state.body.length; i += 1) {
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
        this.lastDistance = this.config.gridResolution * 2;
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
      // if (eating) this.makeFood();
    }

    if (this.currentScore > this.brain.score) {
      this.bestScore = this.currentScore;
    }

    if (this.deaths === 0) {
      this.firstAttempScore = this.currentScore;
      this.brain.score = this.currentScore;
    }

    if (died) {
      context.clearRect(0, 0, 100, 100);
      context.fillStyle = "rgba(255,0,0,.5)";

      for (let i in this.state.body) {
        const d = this.state.body[i];
        context.fillRect(
          (d.x / this.config.gridResolution) * this.config.displaySize.x,
          (d.y / this.config.gridResolution) * this.config.displaySize.y,
          this.config.displaySize.x / this.config.gridResolution,
          this.config.displaySize.y / this.config.gridResolution
        );
      }

      this.restart();
      this.makeFood();

      this.deaths += 1;
      return;
    }
    if (eating) this.makeFood();
  }
}
