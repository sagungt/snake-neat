export default class BinaryHeap {
  public data: Array<any>;
  private scoreFunction: Function;

  constructor(scoreFunction: Function) {
    this.data = [];
    this.scoreFunction = scoreFunction;
  }

  push(element: any): void {
    this.data.push(element);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): any {
    const result = this.data[0];
    const end = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  remove(node: any): void {
    const length = this.data.length;
    for (let i = 0; i < length; i += 1) {
      if (this.data[i] !== node) continue;
      const end = this.data.pop();
      if (i === length - 1) break;
      this.data[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  }

  size(): number {
    return this.data.length;
  }

  bubbleUp(n: number): void {
    const element = this.data[n];
    const score = this.scoreFunction(element);
    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1;
      const parent = this.data[parentN];
      if (score >= this.scoreFunction(parent)) break;
      this.data[parentN] = element;
      this.data[n] = parent;
      n = parentN;
    }
  }

  sinkDown(n: number): void {
    const length = this.data.length;
    const element = this.data[n];
    const elementScore = this.scoreFunction(element);
    while (true) {
      const child2N = (n + 1) * 2;
      const child1N = child2N - 1;
      let swap = null;
      let child1Score;
      if (child1N < length) {
        const child1 = this.data[child1N];
        child1Score = this.scoreFunction(child1);
        if (child1Score < elementScore) swap = child1N;
      }
      if (child2N < length) {
        const child2 = this.data[child2N];
        const child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elementScore : child1Score))
          swap = child2N;
      }
      if (swap === null) break;
      this.data[n] = this.data[swap];
      this.data[swap] = element;
      n = swap;
    }
  }

  rescoreElement(node: any): void {
    this.sinkDown(this.data.indexOf(node));
  }
}
