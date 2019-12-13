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

class BlockGame {
  constructor(private code: string) {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher());
  }
  codeRunner: IntCodeRunner;

  min = new Position();
  max = new Position();
  paddleX = 0;
  ballX = 0;
  tiles = new Map<string, number>();
  _score = 0;

  playGame() {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher(), true);

    this.min = new Position();
    this.max = new Position();

    this.tiles.clear();

    this.codeRunner.setMemory(0, 2);
    this.codeRunner.startRunner();
    //this.codeRunner.addInput(0);
  }

  get tileCount(): number {
    return Array.from(this.tiles.values()).reduce(
      (a, n) => (n === 2 ? a + 1 : a),
      0
    );
  }

  get score(): number {
    return this._score;
  }

  outputCatcher() {
    const me = this;
    let inputStep = 0;
    const inputPos = new Position();
    return (outNum: number) => {
      if (inputStep === 0) {
        inputPos.x = outNum;
        if (outNum < me.min.x) {
          me.min.x = outNum;
        }
        if (outNum > me.max.x) {
          me.max.x = outNum;
        }
      } else if (inputStep === 1) {
        inputPos.y = outNum;
        if (outNum < me.min.y) {
          me.min.y = outNum;
        }
        if (outNum > me.max.y) {
          me.max.y = outNum;
        }
      } else {
        if (inputPos.x === -1 && inputPos.y === 0) {
          me._score = outNum;
        } else {
          me.tiles.set(inputPos.toString(), outNum);
          if (outNum === 3) {
            me.paddleX = inputPos.x;
          } else if (outNum === 4) {
            me.ballX = inputPos.x;
          }
        }
      }
      inputStep++;
      if (inputStep === 3) {
        inputStep = 0;
      }
    };
  }

  play(inputNum: number = 2) {
    this.codeRunner.addInput(inputNum);
  }

  draw() {
    console.clear();
    for (let y = this.min.y; y < this.max.y + 1; y++) {
      let line = '';
      for (let x = this.min.x; x < this.max.x + 1; x++) {
        const posStr = `${x},${y}`;
        if (this.tiles.has(posStr)) {
          if (this.tiles.get(posStr) === 1) {
            line += chalk.bgWhite(' ');
          } else if (this.tiles.get(posStr) === 2) {
            line += chalk.bgRed(' ');
          } else if (this.tiles.get(posStr) === 3) {
            line += chalk.bgGreen(' ');
          } else if (this.tiles.get(posStr) === 4) {
            line += '*';
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
const game = new BlockGame(runData);
console.log(game.tileCount);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
//game.draw();
game.playGame();
while (game.tileCount > 0) {
  //game.draw();
  if (game.ballX > game.paddleX) {
    game.play(1);
  } else if (game.ballX < game.paddleX) {
    game.play(-1);
  } else {
    game.play(0);
  }
}
console.log(game.score);

console.timeEnd('part2');
