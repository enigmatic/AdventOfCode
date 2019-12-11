import chai from 'chai';
import chalk from 'chalk';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '/input.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}
const runData = strData[0];

const directions: Position[] = [
  new Position(0, -1),
  new Position(1, 0),
  new Position(0, 1),
  new Position(-1, 0)
];

class HullPaintingRobot {
  constructor(private code: string) {
    this.codeRunner = new IntCodeRunner(this.code, this.robotOutput());
  }
  codeRunner: IntCodeRunner;

  color = 0;
  direction = 0;
  colorNext = true;
  position = new Position();
  min = new Position();
  max = new Position();
  painted = new Map<string, number>();

  paint(startInput: number) {
    this.codeRunner = new IntCodeRunner(this.code, this.robotOutput());

    this.color = 1;
    this.direction = 0;
    this.colorNext = true;
    this.position = new Position();
    this.min = new Position();
    this.max = new Position();

    this.painted.clear();

    if (startInput === 1) {
      this.painted.set('0,0', startInput);
    }
    this.codeRunner.addInput(startInput);
    while (!this.codeRunner.done) {
      if (this.painted.has(this.position.toString())) {
        this.codeRunner.addInput(
          Number(this.painted.get(this.position.toString()))
        );
      } else {
        this.codeRunner.addInput(0);
      }
    }

    console.log(this.painted.size);
  }
  robotOutput() {
    const me = this;
    return (outNum: number) => {
      if (me.colorNext) {
        me.painted.set(me.position.toString(), outNum);
        me.color = outNum;
        me.colorNext = false;
      } else {
        me.colorNext = true;
        if (outNum === 0) {
          //left
          me.direction--;
          if (me.direction < 0) {
            me.direction += 4;
          }
        } else if (outNum === 1) {
          //left
          me.direction++;
          if (me.direction > 3) {
            me.direction -= 4;
          }
        }

        me.position.x += directions[me.direction].x;
        me.position.y += directions[me.direction].y;
        debug(me.position.toString());

        if (me.position.x > me.max.x) {
          me.max.x = me.position.x;
        }
        if (me.position.y > me.max.y) {
          me.max.y = me.position.y;
        }

        if (me.position.x < me.min.x) {
          me.min.x = me.position.x;
        }
        if (me.position.y < me.min.y) {
          me.min.y = me.position.y;
        }
      }
    };
  }

  draw() {
    for (let y = this.min.y; y < this.max.y + 1; y++) {
      let line = '';
      for (let x = this.min.x; x < this.max.x + 1; x++) {
        const posStr = `${x},${y}`;
        if (this.painted.has(posStr)) {
          if (this.painted.get(posStr) === 1) {
            line += chalk.bgWhite(' ');
          } else {
            line += ' ';
          }
        } else {
          line += ' ';
        }
      }
      console.log(line);
    }
  }
}

console.log('running Data');
console.time('part1');
const bot = new HullPaintingRobot(runData);
bot.paint(0);
console.timeEnd('part1');

console.log('part 2');
bot.paint(1);
bot.draw();
console.time('part2');
console.timeEnd('part2');
