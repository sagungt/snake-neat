import AstarV2 from "./AstarV2";

class Grid {
  private grid: Array<Array<GridNode>>;
  private dirtyNodes: Array<GridNode>;
  private nodes: Array<GridNode>;
  private diagonal: boolean;
  private options: any;
  constructor(gridIn: any, options: any = {}) {
    this.diagonal = !!options.diagonal;
    this.options = options;
    this.dirtyNodes = [];
    this.nodes = [];
    this.grid = [];
    for (let y = 0; y < gridIn.length; y += 1) {
      this.grid[y] = [];
      for (let x = 0, row = gridIn[y]; x < row.length; x += 1) {
        const node = new GridNode(y, x, row[x]);
        this.grid[y][x] = node;
        this.nodes.push(node);
      }
    }
    this.init();
  }

  init(): void {
    this.dirtyNodes = [];
    for (const node of this.nodes) {
      AstarV2.cleanNode(node);
    }
  }

  cleanDirty(): void {
    for (const dirtyNode of this.dirtyNodes) {
      AstarV2.cleanNode(dirtyNode);
    }
    this.dirtyNodes = [];
  }

  markDirty(node: GridNode): void {
    this.dirtyNodes.push(node);
  }

  neighbors(node: GridNode): Array<GridNode> {
    const grid = this.grid;
    const neighbors = [];
    const x = node.x;
    const y = node.y;

    if (grid[x - 1] && grid[x - 1][y]) {
      neighbors.push(grid[x - 1][y]);
    }

    if (grid[x + 1] && grid[x + 1][y]) {
      neighbors.push(grid[x + 1][y]);
    }

    if (grid[x] && grid[x][y - 1]) {
      neighbors.push(grid[x][y - 1]);
    }

    if (grid[x] && grid[x][y + 1]) {
      neighbors.push(grid[x][y + 1]);
    }

    if (this.diagonal) {
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        neighbors.push(grid[x - 1][y - 1]);
      }

      if (grid[x + 1] && grid[x + 1][y - 1]) {
        neighbors.push(grid[x + 1][y - 1]);
      }

      if (grid[x - 1] && grid[x - 1][y + 1]) {
        neighbors.push(grid[x - 1][y + 1]);
      }

      if (grid[x + 1] && grid[x + 1][y + 1]) {
        neighbors.push(grid[x + 1][y + 1]);
      }
    }

    return neighbors;
  }

  toString(): string {
    const graphString = [];
    const nodes = this.grid;
    for (const node of nodes) {
      const rowDebug = [];
      for (const row of node) {
        rowDebug.push(row.weight);
      }
      graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
  }
}

class GridNode {
  public visited: boolean;
  public closed: boolean;
  public weight: number;
  public parent: any;
  public x: number;
  public y: number;
  public f: number;
  public g: number;
  public h: number;
  constructor(x: number, y: number, weight: number) {
    this.weight = weight;
    this.visited = false;
    this.closed = false;
    this.parent = null;
    this.x = x;
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  toString(): string {
    return `[${this.x} ${this.y}]`;
  }

  getCost(fromNeighbor: GridNode): number {
    if (
      fromNeighbor &&
      fromNeighbor.x !== this.x &&
      fromNeighbor.y !== this.y
    ) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }

  isWall(): boolean {
    return this.weight === 0;
  }
}

export { Grid, GridNode };
