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
  gridSize: number;
  displaySize: ICoordinate;
  growWhenEating: boolean;
  borderWalls: boolean;
  canEatSelf: boolean;
  initialSnakeLength?: any;
  foodScore?: any;
  moveTowardsScore?: any;
  moveAwayScore?: any;
}

export interface IManagerConfig extends ISnakeConfig {
  populationSize: number;
  elitismPercent: number;
  showGraphLog: boolean;
  hiddenNodes?: number;
}
