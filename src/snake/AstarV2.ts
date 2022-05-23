import BinaryHeap from "../helper/BinaryHeap";
import { Grid, GridNode } from "./Grid";

function compare(node1: GridNode, node2: GridNode): boolean {
  return node1.x === node2.x && node1.y === node2.y;
}

function pathTo(node: GridNode) {
  let curr = node;
  const path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap(): BinaryHeap {
  return new BinaryHeap((node: GridNode) => node.f);
}

export default class AstarV2 {
  public static search(graph: Grid, start: any, end: any, options: any = {}) {
    graph.cleanDirty();
    let heuristic!: Function;
    if (options.heuristic === "euclidean")
      heuristic = AstarV2.heuristics.euclidean;
    if (options.heuristic === "manhattan")
      heuristic = AstarV2.heuristics.manhattan;
    const closest = options.closest || false;

    const openHeap = getHeap();
    let closestNode = start;

    start = new GridNode(start.x, start.y, 1);
    end = new GridNode(end.x, end.y, 1);
    start.h = heuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop();

      if (compare(currentNode, end)) {
        return pathTo(currentNode);
      }
      currentNode.closed = true;
      const neighbors = graph.neighbors(currentNode);

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        const neighbor = neighbors[i];
        if (neighbor.closed || neighbor.isWall()) {
          continue;
        }
        if (options.canEatSelf) {
          if (options.body) {
            let isBody = false;
            for (const body of options.body) {
              if (compare(body, neighbor)) {
                isBody = true;
                break;
              }
            }
            if (isBody) continue;
          }
        }
        const gScore = currentNode.g + neighbor.getCost(currentNode);
        const beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            if (
              neighbor.h < closestNode.h ||
              (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
            ) {
              closestNode = neighbor;
            }
          }
          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }
    if (closest) {
      return pathTo(closestNode);
    }
    return [];
  }

  public static cleanNode(node: GridNode): void {
    node.visited = false;
    node.closed = false;
    node.parent = null;
    node.f = 0;
    node.g = 0;
    node.h = 0;
  }

  public static heuristics = {
    manhattan: (node: GridNode, goal: GridNode) => {
      const dx = Math.abs(goal.x - node.x);
      const dy = Math.abs(goal.y - node.y);
      return dx + dy;
    },
    diagonal: (node: GridNode, goal: GridNode) => {
      const D = 1;
      const D2 = Math.sqrt(2);
      const dx = Math.abs(goal.x - node.x);
      const dy = Math.abs(goal.y - node.y);
      return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    },
    euclidean: (node: GridNode, goal: GridNode) => {
      const dx = (goal.x - node.x) ** 2;
      const dy = (goal.y - node.y) ** 2;
      return Math.sqrt(dx + dy);
    },
  };
}
