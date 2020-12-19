import * as fs from 'fs';

export function ReadFile(fileName: string): string[] {
  const input: string = fs.readFileSync(fileName, 'utf8');
  let inputArray: string[] = input.split('\r\n');
  if (inputArray.length === 1) {
    inputArray = input.split('\n');
  }

  return inputArray;
}


export function manhattanDist(x1: number, y1: number, x2: number, y2: number): number {
  return x1 - x2 + y1 - y2;
}

export class Position {
  owner = 0; //for Day
  steps = 0; //Pathfinding helper

  constructor(public x = 0, public y = 0, public z = 0) {}

  fromXYCoords(xy: string) {
    const xyNum = xy.split(',').map(n => Number(n));
    this.x = xyNum[0];
    this.y = xyNum[1];
    if (xyNum.length > 2) {
      this.z = xyNum[2];
    }
  }

  toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }
  toXYString(): string {
    return `${this.x},${this.y}`;
  }

  add(delta: Position) {
    this.x += delta.x;
    this.y += delta.y;
    this.z += delta.z;
  }

  addValues(x: number = 0, y: number = 0, z: number = 0) {
    this.x += x;
    this.y += y;
    this.z += z;
  }

  move(delta: Position, size: number) {
    this.x += delta.x * size;
    this.y += delta.y * size;
    this.z += delta.z * size;

  }
  rotate(degrees:number) {
    const newX = Math.round(this.x * Math.cos(Math.PI * degrees/180) - this.y * Math.sin(Math.PI * degrees / 180));
    this.y = Math.round(this.x * Math.sin(Math.PI * degrees/180) + this.y * Math.cos(Math.PI * degrees / 180));
    this.x = newX;
  }

  get energy(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  taxiDistance(p: Position) {
    return (
      Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z)
    );
  }
  
  taxiDistanceXY(x = 0, y = 0, z = 0) {
    return (
      Math.abs(this.x - x) + Math.abs(this.y - y) + Math.abs(this.z - z)
    );
  }

  get neighbors(): Position[] {
    return [
      new Position(this.x, this.y - 1),
      new Position(this.x + 1, this.y),
      new Position(this.x, this.y + 1),
      new Position(this.x - 1, this.y)
    ];
  }
}

export const directions: Position[] = [
  new Position(0, -1),
  new Position(1, 0),
  new Position(0, 1),
  new Position(-1, 0)
];
