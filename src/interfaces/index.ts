export interface ICoordinate {
  x: number;
  y: number;
}

export interface ITwoCoordinate {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface ISnakeConfig {
  displaySize: ICoordinate;
  growWhenEating: boolean;
  borderWalls: boolean;
  canEatSelf: boolean;
  gridSize: number;
  initialSnakeLength?: any;
  moveTowardsScore?: any;
  astarVersion?: number;
  moveAwayScore?: any;
  foodScore?: any;
  heuristic?: string;
}

export interface IManagerConfig extends ISnakeConfig {
  populationSize: number;
  elitismPercent: number;
  showGraphLog: boolean;
  hiddenNodes?: number;
}

export interface IAstar {
  start: ICoordinate;
  grid: ICoordinate;
  goal: ICoordinate;
  options?: any;
}
