import { ICoordinate, ITwoCoordinate } from "../interfaces";

/**
 * Calculate distance between two coordinate
 * @param {ITwoCoordinate} object - Two coordinates x1, x2, y1, y2
 * @return {number} - return distance between two coordinated
 */
const distance = ({ x1, y1, x2, y2 }: ITwoCoordinate): number => {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle
 * @param {ITwoCoordinate} object - Two coordinates x1, x2, y1, y2
 * @return {number} - return angle in radians
 */
const angleToPoint = ({ x1, y1, x2, y2 }: ITwoCoordinate): number =>
  Math.atan2(y2 - y1, x2 - x1);

/**
 * Convert radians to degrees
 * @param {number} r - Radians
 * @return {number} - return in degrees
 */
const radiansToDegrees = (r: number): number => (r / (Math.PI * 2)) * 360;

/**
 * Calculate quartal
 * @param {Array.<any>} values - Array of data
 * @param {number} Q - Quartal
 * @return {number} - return quartal of data
 */
const calculateQ = (values: Array<any>, Q: number): number => {
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

/**
 * Calculate euclidean heuristic distance between two coordinate
 * @param start - Start coordinate {x, y}
 * @param goal - End coordinate {x, y}
 * @return {number} - return distance
 */
const euclidean = (start: ICoordinate, goal: ICoordinate): number =>
  Math.sqrt((goal.x - start.x) ** 2 + (goal.y - start.y) ** 2);

/**
 * Calculate manhattan heuristic distance between two coordinate
 * @param start
 * @param goal
 * @returns
 */
const manhattan = (start: ICoordinate, goal: ICoordinate): number => {
  const d1 = Math.abs(goal.x - start.x);
  const d2 = Math.abs(goal.y - start.y);
  return d1 + d2;
};

/**
 * Create zeros 2d array
 * @param {Array} dimensions - Array dimensions in 2d {x, y}
 * @returns {Array.<Array.<number>>} - return array 2d
 */
const zeros = (
  dimensions: Array<number>,
  val: any = 0
): Array<Array<number>> => {
  const array: Array<any> = [];
  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(Array(dimensions[1]).fill(val));
  }
  return array;
};

/**
 * Convert object values to array
 * @param {Object} obj - Object
 * @returns {any}
 */
const objectValuesToArray = (obj: Object): any => Object.values(obj);

/**
 * Check if object has property
 * @param item - item property
 * @param object - object
 * @return {boolean}
 */
const inObject = (item: any, object: Object): boolean =>
  object.hasOwnProperty(item) ? true : false;

/**
 * Compare 2 arrays
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {boolean}
 */
const arrayIsEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  else {
    let result: boolean = true;
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] === arr2[i]) result &&= true;
      else result &&= false;
    }
    return result === true;
  }
};

/**
 * Check if item is in set
 * @param {any} item
 * @param {Set} set
 * @return {boolean}
 */
const inSet = (item: any, set: Set<any>): boolean => {
  let result = false;
  set.forEach((val) => {
    if (arrayIsEqual(item, objectValuesToArray(val))) result = true;
  });
  return result;
};

/**
 * Check if item is in array
 * @param {any} item
 * @param {Array.<any>} array
 * @return {boolean}
 */
const inArray = (item: any, array: Array<any>): boolean =>
  array.map((val: any) => val.toString()).indexOf(item.toString()) !== -1;

export {
  objectValuesToArray,
  radiansToDegrees,
  angleToPoint,
  arrayIsEqual,
  calculateQ,
  manhattan,
  euclidean,
  distance,
  inObject,
  inArray,
  zeros,
  inSet,
};
