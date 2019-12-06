import chai from 'chai';
import readFile from '../../lib/readFile';

let strData: string[] = readFile(__dirname + '\\input.txt');
let debug = false;

class dir {
  x = 0;
  y = 0;
}

const dirAdd: Map<string, dir> = new Map();
dirAdd.set('R', { x: 1, y: 0 });
dirAdd.set('U', { x: 0, y: 1 });
dirAdd.set('L', { x: -1, y: 0 });
dirAdd.set('D', { x: 0, y: -1 });

function getWireMap(wire: string): Set<string> {
  const wMap = new Set<string>();

  let moves = wire.split(',');
  let x = 0;
  let y = 0;
  let i = 0;
  while (i < moves.length) {
    const move = moves[i];
    const dir = dirAdd.get(move.charAt(0)) as dir;
    const len = Number(move.substr(1));
    for (let m = 0; m < len; m++) {
      x += dir.x;
      y += dir.y;

      wMap.add(`${x}, ${y}`);
    }
    i++;
  }
  return wMap;
}

function intersectionList(wire: string, map: Set<string>): Set<string> {
  const intersections = new Set<string>();

  let moves = wire.split(',');
  let x = 0;
  let y = 0;
  let i = 0;
  while (i < moves.length) {
    const move = moves[i];
    const dir = dirAdd.get(move.charAt(0)) as dir;
    const len = Number(move.substr(1));
    for (let m = 0; m < len; m++) {
      x += dir.x;
      y += dir.y;

      const location = `${x}, ${y}`;
      if (map.has(location)) {
        intersections.add(location);
      }
    }
    i++;
  }

  return intersections;
}

function simpleDist(xy: string): number {
  return xy
    .split(',')
    .map(v => Math.abs(Number(v)))
    .reduce((a, v) => a + v, 0);
}

function findSteps(
  wire: string,
  intersections: Set<string>
): Map<string, number> {
  const steps = new Map<string, number>();

  let moves = wire.split(',');
  let x = 0;
  let y = 0;
  let i = 0;
  let stepCount = 0;
  while (i < moves.length) {
    const move = moves[i];
    const dir = dirAdd.get(move.charAt(0)) as dir;
    const len = Number(move.substr(1));
    for (let m = 0; m < len; m++) {
      x += dir.x;
      y += dir.y;
      stepCount++;

      const location = `${x}, ${y}`;
      if (intersections.has(location) && !steps.has(location)) {
        steps.set(location, stepCount);
      }
    }
    i++;
  }

  return steps;
}

function findFewestSteps(wire1: string, wire2: string): number {
  const map = getWireMap(wire1);

  const ints = intersectionList(wire2, map);

  const steps1 = findSteps(wire1, ints);
  const steps2 = findSteps(wire2, ints);

  return Array.from(ints.values()).reduce((a, v) => {
    const stepTotal = (steps1.get(v) as number) + (steps2.get(v) as number);
    return stepTotal < a ? stepTotal : a;
  }, 100000000);
}

function tests() {
  chai.assert.equal(findFewestSteps('R8,U5,L5,D3', 'U7,R6,D4,L4'), 30);
  chai.assert.equal(
    findFewestSteps(
      'R75,D30,R83,U83,L12,D49,R71,U7,L72',
      'U62,R66,U55,R34,D71,R55,D58,R83'
    ),
    610
  );
  chai.assert.equal(
    findFewestSteps(
      'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
      'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
    ),
    410
  );
}

tests();

console.log(findFewestSteps(strData[0], strData[1]));
