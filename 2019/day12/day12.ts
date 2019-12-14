import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData;

function GCD(a: number, b: number): number {
  if (b === 0) {
    return a;
  } else {
    return GCD(b, a % b);
  }
}

class Moon {
  pos: Position;
  velocity: Position = new Position();
  constructor(x: number, y: number, z: number) {
    this.pos = new Position(x, y, z);
  }
}

function loadMoons(moonData: string[]): Moon[] {
  const moons: Moon[] = [];
  moonData.forEach(line => {
    const values = line
      .substr(1, line.length - 2)
      .split(',')
      .map(v => Number(v.trim().substr(2)));
    const m = new Moon(values[0], values[1], values[2]);
    moons.push(m);
  });

  return moons;
}

function calcGravity(moons: Array<Moon>) {
  moons.forEach(moon => {
    moons.forEach(pullMoon => {
      if (moon === pullMoon) {
        return;
      }

      if (moon.pos.x < pullMoon.pos.x) {
        moon.velocity.x += 1;
      } else if (moon.pos.x > pullMoon.pos.x) {
        moon.velocity.x -= 1;
      }

      if (moon.pos.y < pullMoon.pos.y) {
        moon.velocity.y += 1;
      } else if (moon.pos.y > pullMoon.pos.y) {
        moon.velocity.y -= 1;
      }

      if (moon.pos.z < pullMoon.pos.z) {
        moon.velocity.z += 1;
      } else if (moon.pos.z > pullMoon.pos.z) {
        moon.velocity.z -= 1;
      }
    });
  });
}

function moveMoons(moons: Array<Moon>) {
  moons.forEach(moon => {
    moon.pos.add(moon.velocity);
  });
}

function getTotalEnergy(moons: Array<Moon>): number {
  return moons.reduce(
    (a, moon) => a + moon.pos.energy * moon.velocity.energy,
    0
  );
}

function moonHash(moons: Array<Moon>): string {
  let hashStr = '';
  moons.forEach((moon, i) => {
    hashStr += moon.pos.toString();
  });
  return hashStr.replace(',', '');
}

function countLoopSize(moonString: string[]): number {
  const moons = loadMoons(moonString);
  const initialData = loadMoons(moonString);

  let loops = 0;
  const loopDist = new Position();

  const testAxis = (axis: number): boolean => {
    let match = true;
    for (let i = 0; i < 4; i++) {
      if (axis === 0) {
        match = moons[i].pos.x === initialData[i].pos.x;
      } else if (axis === 1) {
        match = moons[i].pos.y === initialData[i].pos.y;
      } else if (axis === 2) {
        match = moons[i].pos.z === initialData[i].pos.z;
      }
      if (!match) {
        return false;
      }
    }
    return match;
  };

  while (true) {
    calcGravity(moons);
    moveMoons(moons);

    loops++;
    if (loopDist.x === 0) {
      if (moons.reduce((still, moon) => still && moon.velocity.x === 0, true)) {
        if (testAxis(0)) {
          loopDist.x = loops;
        }
      }
    }

    if (loopDist.y === 0) {
      if (moons.reduce((still, moon) => still && moon.velocity.y === 0, true)) {
        if (testAxis(1)) {
          loopDist.y = loops;
        }
      }
    }

    if (loopDist.z === 0) {
      if (moons.reduce((still, moon) => still && moon.velocity.z === 0, true)) {
        if (testAxis(2)) {
          loopDist.z = loops;
        }
      }
    }

    if (loopDist.x > 0 && loopDist.y > 0 && loopDist.z > 0) {
      break;
    }
  }

  const multiples = new Set<number>();
  const gcdXY = GCD(loopDist.x, loopDist.y);
  const lcmXY = (loopDist.x * loopDist.y) / gcdXY;
  const gcdXYZ = GCD(lcmXY, loopDist.z);

  loops = (lcmXY * loopDist.z) / gcdXYZ;

  return loops;
}

function tests() {
  console.log('running Tests');
  // tslint:disable-next-line: no-console
  console.time('tests');

  let testData: string[] = readFile(__dirname + '\\sample1.txt');
  let testMoons = loadMoons(testData);
  chai.assert.equal(testMoons.length, 4);
  chai.assert.equal(testMoons[0].pos.toString(), '-1,0,2');
  chai.assert.equal(testMoons[0].velocity.toString(), '0,0,0');

  calcGravity(testMoons);
  chai.assert.equal(testMoons[0].velocity.toString(), '3,-1,-1');
  chai.assert.equal(testMoons[0].pos.toString(), '-1,0,2');

  moveMoons(testMoons);
  chai.assert.equal(testMoons[0].pos.toString(), '2,-1,1');

  for (let i = 1; i < 10; i++) {
    calcGravity(testMoons);
    moveMoons(testMoons);
  }
  chai.assert.equal(testMoons[0].pos.toString(), '2,1,-3');
  chai.assert.equal(testMoons[0].velocity.toString(), '-3,-2,1');
  chai.assert.equal(getTotalEnergy(testMoons), 179);

  chai.assert.equal(countLoopSize(testData), 2772);

  console.log('Sample 2 Tests');

  testData = readFile(__dirname + '\\sample2.txt');
  testMoons = loadMoons(testData);
  for (let i = 0; i < 100; i++) {
    calcGravity(testMoons);
    moveMoons(testMoons);
  }
  chai.assert.equal(getTotalEnergy(testMoons), 1940);

  chai.assert.equal(countLoopSize(testData), 4686774924);
  // tslint:disable-next-line: no-console
  console.timeEnd('tests');
}

tests();

console.log('running Data');
// tslint:disable-next-line: no-console
console.time('part1');
const problemMoons = loadMoons(strData);
for (let i = 0; i < 1000; i++) {
  calcGravity(problemMoons);
  moveMoons(problemMoons);
}
console.log(getTotalEnergy(problemMoons));
// tslint:disable-next-line: no-console
console.timeEnd('part1');

console.log('part 2');
// tslint:disable-next-line: no-console
console.time('part2');

console.log(countLoopSize(strData));
// tslint:disable-next-line: no-console
console.timeEnd('part2');
