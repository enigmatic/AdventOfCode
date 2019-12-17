export class Position {
  constructor(public x = 0, public y = 0) {}

  fromXYCoords(xy: string) {
    const xyNum = xy.split(',').map(n => Number(n));
    this.x = xyNum[0];
    this.y = xyNum[1];
  }

  toString(): string {
    return `${this.x},${this.y}`;
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
