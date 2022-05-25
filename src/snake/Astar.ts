import {
  objectValuesToArray,
  manhattan,
  euclidean,
  inObject,
  inArray,
  inSet,
} from "../helper/Helper";
import { IAstar, ICoordinate } from "../interfaces";
import BinaryHeap from "../helper/BinaryHeap";

/**
 * A* (A Star) algorithm pathfinder
 * @param {IAstar} - Object of grid, start, goal, and body
 * @returns {Array.<ICoordinate>} - returns the path from start to goal in array
 */
export default function Astar({
  grid,
  start,
  goal,
  options,
}: IAstar): Array<ICoordinate> {
  const neighbors = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  let heuristicFunction!: Function;
  if (options.heuristic === "manhattan") heuristicFunction = manhattan;
  if (options.heuristic === "euclidean") heuristicFunction = euclidean;
  const startArray = objectValuesToArray(start);
  const cameFrom: any = {};
  const gScore: any = { [startArray]: 0 };
  const fScore = { [startArray]: heuristicFunction(start, goal) };
  const close = new Set();
  const heap = new BinaryHeap((x: Array<any>) => x[0]);
  let x: Array<any> = [];
  let current: any;

  heap.push([fScore[startArray], startArray]);

  while (heap.size() > 0) {
    current = heap.pop()[1];

    if (current[0] === goal.x && current[1] === goal.y) {
      const data = [];
      let tmp = current;
      while (inObject(tmp, cameFrom)) {
        data.push(cameFrom[tmp]);
        tmp = cameFrom[tmp];
      }
      data.push([goal.x, goal.y]);
      return [...data.reverse().slice(1), [goal.x, goal.y]].map(
        (val: Array<number>) => ({ x: val[0], y: val[1] })
      );
    }
    close.add(current);

    for (const item of neighbors) {
      const neighbor: any = [current[0] + item[0], current[1] + item[1]];

      if (0 <= neighbor[0] && neighbor[0] < grid.x) {
        if (0 <= neighbor[1] && neighbor[1] < grid.y) {
          if (options.canEatSelf) {
            let bodyCollision = false;
            for (const b of options.body) {
              if (b.x === neighbor[0] && b.y === neighbor[1]) {
                bodyCollision = true;
                break;
              }
            }
            if (bodyCollision) {
              continue;
            }
          }
        } else continue;
      } else continue;

      const tentativeGScore =
        gScore[current] +
        heuristicFunction(
          { x: current[0], y: current[1] },
          { x: neighbor[0], y: neighbor[1] }
        );

      if (inSet(neighbor, close) && tentativeGScore >= (gScore[neighbor] || 0))
        continue;

      x = [];
      for (const h of heap.data) {
        x.push(objectValuesToArray(h[1]));
      }

      if (tentativeGScore < (gScore[neighbor] || 0) || !inArray(neighbor, x)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] =
          tentativeGScore +
          heuristicFunction({ x: neighbor[0], y: neighbor[1] }, goal);
        heap.push([fScore[neighbor], neighbor]);
      }
    }
  }
  return [];
}
