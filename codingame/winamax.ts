const debugging = false;

class BallPoint {
  x = 0;
  y = 0;
  h = 0;
  c = ' ';

  constructor(x: number, y: number, h: number = 0) {
    this.x = x;
    this.y = y;
    this.h = h;
  }
}

class BallToHit {
  b: BallPoint;
  d: BallPoint;
  constructor(ball: BallPoint, direction: BallPoint) {
    this.b = ball;
    this.d = direction;
  }
}

const hitDirs: BallPoint[] = [
  { x: 1, y: 0, c: '>', h: 0 },
  { x: 0, y: 1, c: 'v', h: 0 },
  { x: -1, y: 0, c: '<', h: 0 },
  { x: 0, y: -1, c: '^', h: 0 }
];

const balls: BallPoint[] = [];
var inputs: string[] = readline().split(' ');
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);

let initialCourse: string[] = [];

function printCourse(course: string[]) {
  if (!debugging) return;
  for (let h = 0; h < height; h++) {
    console.error(course[h]);
  }
}

function printMoves(course: string[]) {
  const re = /[SX]/gi;
  for (let h = 0; h < height; h++) {
    console.log(course[h].replace(re, '.'));
  }
}

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}

function hitBall(
  ball: number,
  dir: BallPoint,
  course: string[],
  balls: BallPoint[]
): void {
  let bx = balls[ball].x;
  let by = balls[ball].y;
  let ballMoves = balls[ball].h;
  let myMove = ballMoves;
  while (myMove > 0) {
    myMove--;
    course[by] = setCharAt(course[by], bx, dir.c);
    bx += dir.x;
    by += dir.y;
  }

  let space = course[by].charAt(bx);
  if (space === 'H') {
    course[by] = setCharAt(course[by], bx, 'S');
    balls.splice(ball, 1);
  } else {
    course[by] = setCharAt(course[by], bx, (ballMoves - 1).toString());
    balls[ball].x = bx;
    balls[ball].y = by;
    balls[ball].h = ballMoves - 1;
  }
}

function validMoves(b: BallPoint, course: string[]): BallPoint[] {
  let space = course[b.y].charAt(b.x);
  let ballMoves = Number(space);
  if (ballMoves) {
    return hitDirs.filter(v => {
      let myMove = ballMoves;
      let curX = b.x;
      let curY = b.y;
      while (myMove > 0) {
        curX += v.x;
        curY += v.y;
        if (curX < 0 || curX >= width || curY < 0 || curY >= height)
          return false;

        myMove--;
        let test = course[curY].charAt(curX);
        if (
          test !== '.' &&
          !(myMove > 0 && test === 'X') &&
          !(myMove === 0 && test === 'H')
        ) {
          return false;
        }
      }
      return true;
    });
  }
  return [];
}

function mustMove(course: string[], balls: BallPoint[]): number {
  let movesToMake: BallToHit[] = [];
  for (let ball of balls) {
    let moves = validMoves(ball, course);
    if (debugging) console.error(moves);
    if (moves.length === 1) {
      movesToMake.push(new BallToHit(ball, moves[0]));
    }
  }
  movesToMake.forEach(v => hitBall(balls.indexOf(v.b), v.d, course, balls));

  return movesToMake.length;
}

function solveCourse(course: string[], balls: BallPoint[]): string[] {
  printCourse(course);
  while (mustMove(course, balls) > 0) {
    if (debugging) console.error('---------- ' + balls.length);
    printCourse(course);
  }

  if (balls.length === 0) {
    const moreHoles = course.some(line => line.indexOf('H') > -1);
    if (moreHoles) return [];
    else return course;
  }
  let moves = validMoves(balls[0], course);

  if (debugging)
    console.error(`ball at (${balls[0].x}, ${balls[0].y}) needs help`);

  for (let move of moves) {
    let testCourse: string[] = course.map(v => v.toString());
    let testBalls: BallPoint[] = balls.map(v => new BallPoint(v.x, v.y, v.h));
    if (debugging) console.error('Test Balls: ' + JSON.stringify(testBalls));

    hitBall(0, move, testCourse, testBalls);
    let solvedCourse = solveCourse(testCourse, testBalls);
    if (solvedCourse.length > 0) return solvedCourse;
  }

  return [];
}

for (let i = 0; i < height; i++) {
  const row: string = readline();
  initialCourse.push(row);
  let chars = row.split('');
  for (let j = 0; j < chars.length; j++) {
    let hits = Number(chars[j]);
    if (hits) {
      balls.push({ x: j, y: i, h: hits, c: chars[j] });
    }
  }
}

printMoves(solveCourse(initialCourse, balls));
