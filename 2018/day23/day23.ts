console.time('day23');

import readFile from '../lib/readFile';

const data: string[] = readFile(__dirname + '/input.txt');
const debug = false;

class Coordinate {
  x: number;
  y: number;
  z: number;
  r: number;
  constructor(x: number, y: number, z: number, r: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
  }

  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

const taxiDist = (a: Coordinate, b: Coordinate): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
};

const cList: Coordinate[] = [];
let bigRadius: Coordinate = new Coordinate(0, 0, 0, 0);
data.forEach(line => {
  const coordEnd = line.indexOf('>');
  const coords = line
    .substring(5, coordEnd)
    .split(',')
    .map(s => parseInt(s));
  const radius = parseInt(line.substr(coordEnd + 5));
  const c = new Coordinate(coords[0], coords[1], coords[2], radius);
  if (c.r > bigRadius.r) {
    bigRadius = c;
  }
  cList.push(c);
});

let inRange = 0;
const min = new Coordinate(0, 0, 0, 0);
const max = new Coordinate(0, 0, 0, 0);
cList.forEach(c => {
  if (c.x < min.x) {
    min.x = c.x;
  }
  if (c.x > max.x) {
    max.x = c.x;
  }
  if (c.y < min.y) {
    min.y = c.y;
  }
  if (c.y > max.y) {
    max.y = c.y;
  }
  if (c.z < min.z) {
    min.z = c.z;
  }
  if (c.z > max.z) {
    max.z = c.z;
  }
  if (taxiDist(c, bigRadius) <= bigRadius.r) {
    inRange++;
  }
});

console.log('part 1:', inRange);
console.timeEnd('day23');

console.time('part2');

function Corners(start: Coordinate, end: Coordinate): Coordinate[] {
  return [
    start,
    new Coordinate(end.x, start.y, start.z, 0),
    new Coordinate(start.x, end.y, start.z, 0),
    new Coordinate(start.x, start.y, end.z, 0),
    new Coordinate(start.x, end.y, end.z, 0),
    new Coordinate(end.x, start.y, end.z, 0),
    new Coordinate(end.x, end.y, start.z, 0),
    end
  ];
}

function PointsInRange(start: Coordinate, end: Coordinate): number {
  const count = 0;
  const corners = Corners(start, end);
  return cList.reduce((a, c) => {
    if (corners.some(corner => taxiDist(c, corner) <= c.r)) {
      return a + 1;
    }
    return a;
  }, 0);
}

let myStart = min;
let myEnd = max;

while (
  myStart.x !== myEnd.x &&
  myStart.y !== myEnd.y &&
  myStart.z !== myEnd.z
) {
  const pivot: Coordinate = new Coordinate(
    Math.round((myStart.x + myEnd.x) / 2),
    Math.round((myStart.y + myEnd.y) / 2),
    Math.round((myStart.z + myEnd.z) / 2),
    0
  );
  const corners = Corners(myStart, myEnd);

  const best = corners.reduce((prev, p) => {
    if (PointsInRange(prev, pivot) <= PointsInRange(p, pivot)) {
      return p;
    } else {
      return prev;
    }
  });

  myStart = best;
  myEnd = pivot;
  if (taxiDist(myStart, myEnd) === 3) {
    myEnd = best;
  }
}
console.log(myStart.toString());
console.log(myStart.x + myStart.y + myStart.z);

console.timeEnd('part2');
