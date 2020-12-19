import chai from "chai";
import { count } from "console";
import {
  ReadFile,
  manhattanDist,
  directions,
  Position,
} from "../../lib/AdventOfCode";

const strData: string[] = ReadFile(__dirname + "/input.txt");
const sampleData: string[] = ReadFile(__dirname + "/sample.txt");
const debugging = false;

class Turtle {
  p: Position = new Position(0, 0);
  dir = 1;

  act(instuction: string) {
    let count = parseInt(instuction.substr(1));
    switch (instuction[0]) {
      case "F":
        this.p.move(directions[this.dir], count);
        break;
      case "N":
        this.p.move(directions[0], count);
        break;
      case "E":
        this.p.move(directions[1], count);
        break;
      case "S":
        this.p.move(directions[2], count);
        break;
      case "W":
        this.p.move(directions[3], count);
        break;
      case 'L':
        this.dir -= count / 90;
        while (this.dir < 0) this.dir += 4;
        break;
      case 'R':
        this.dir += count / 90;
        while (this.dir > 3) this.dir -= 4;
      default:
        break;
    }
  }
}

class P2Turtle {
  p: Position = new Position(0, 0);
  w: Position = new Position(10, -1);
  
  act(instuction: string) {
    let count = parseInt(instuction.substr(1));
    switch (instuction[0]) {
      case "F":
        this.p.move(this.w, count);
        break;
      case "N":
        this.w.move(directions[0], count);
        break;
      case "E":
        this.w.move(directions[1], count);
        break;
      case "S":
        this.w.move(directions[2], count);
        break;
      case "W":
        this.w.move(directions[3], count);
        break;
      case 'L':
        this.w.rotate(-count);
        break;
      case 'R':
        this.w.rotate(count);
      default:
        break;
    }
  }

}

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function tests() {
  const t = new Turtle();
  sampleData.forEach(line => t.act(line));
  chai.expect(t.p.taxiDistanceXY()).to.eq(25);

  const t2 = new P2Turtle();
  sampleData.forEach(line => t2.act(line));
  chai.expect(t2.p.taxiDistanceXY()).to.eq(286);
  
}

console.log("running tests");
tests();

console.log("running Data");
console.time("part1");

const t = new Turtle();
strData.forEach(line => t.act(line));
console.log(t.p.taxiDistanceXY());

console.timeEnd("part1");

console.log("part 2");
console.time("part2");

const t2 = new P2Turtle();
strData.forEach(line => t2.act(line));
console.log(t2.p.taxiDistanceXY());
console.timeEnd("part2");
