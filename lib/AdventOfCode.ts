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
}
