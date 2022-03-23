import { ITwoCoordinate } from "../interfaces";

const distance = ({ x1, y1, x2, y2 }: ITwoCoordinate) => {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
};

const angleToPoint = ({ x1, y1, x2, y2 }: ITwoCoordinate) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

const radiansToDegrees = (r: number) => {
  return (r / (Math.PI * 2)) * 360;
};

const calculateQ = (values: any, Q: number): number => {
  values.sort((a: any, b: any) => a.score - b.score);

  if (values.length === 0) return 0;

  const index = Math.floor(values.length * Q);

  if (values.length % 2) {
    return parseInt(values[index].score, 10);
  } else {
    if (index - 1 < 0) return 0;
    return (values[index - 1].score + values[index].score) / 2.0;
  }
};

export { distance, angleToPoint, radiansToDegrees, calculateQ };
