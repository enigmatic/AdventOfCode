export class Position {
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

  get energy(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  taxiDistance(p: Position) {
    return (
      Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z)
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
