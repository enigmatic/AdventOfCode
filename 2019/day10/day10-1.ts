import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';

const strData: string[] = readFile(__dirname + '/input.txt')[0].split('\n');
const debug = false;

class StarMap {
  asteroids = new Set<string>();
  max = new Position();
  min = new Position();
}

function loadMap(strMap: string[]): StarMap {
  const loadedMap = new StarMap();

  strMap.forEach((line, y) => {
    line.split('').forEach((v, x) => {
      if (v === '#') {
        loadedMap.asteroids.add(`${x},${y}`);
        //console.log(`Add (${x},${y})`);
        if (x + 1 > loadedMap.max.x) {
          loadedMap.max.x = x + 1;
        }
        if (y + 1 > loadedMap.max.y) {
          loadedMap.max.y = y + 1;
        }
      }
    });
  });

  return loadedMap;
}

function sensorCount(pos: Position, map: StarMap): number {
  let sensed = 0;
  const checked = new Set<string>();
  const check: Array<Position> = [];
  for (let x = map.min.x; x < map.max.x; x++) {
    for (let y = map.min.y; y < map.max.y; y++) {
      if (!(x === pos.x && y === pos.y)) {
        check.push(new Position(x, y));
      }
    }
  }

  check.sort((a, b) => {
    const aDist = Math.abs(a.x - pos.x) + Math.abs(a.y - pos.y);
    const bDist = Math.abs(b.x - pos.x) + Math.abs(b.y - pos.y);
    return aDist - bDist;
  });

  if (debug) {
    console.log(check[0]);
  }

  for (let i = 0; i < check.length; i++) {
    const a = check[i];
    let locStr = `${a.x},${a.y}`;
    if (debug) {
      console.log(`Checking (${locStr})`);
    }

    if (checked.has(locStr)) {
      continue;
    }

    let blocking = false;

    const delta = new Position();
    delta.x = a.x - pos.x;
    delta.y = a.y - pos.y;

    const nextPos = new Position();
    nextPos.x = a.x;
    nextPos.y = a.y;

    while (
      nextPos.x >= map.min.x &&
      nextPos.x < map.max.x &&
      nextPos.y >= map.min.y &&
      nextPos.y < map.max.y
    ) {
      locStr = `${nextPos.x},${nextPos.y}`;
      if (!blocking && map.asteroids.has(locStr)) {
        if (debug) {
          console.log(`-- Found (${locStr})`);
        }
        sensed++;
        blocking = true;
      } else if (debug && map.asteroids.has(locStr)) {
        console.log(`  ---- Blocked (${locStr})`);
      }
      checked.add(locStr);

      nextPos.x += delta.x;
      nextPos.y += delta.y;
    }
  }

  return sensed;
}

function bestLocation(map: StarMap): Position {
  let p = new Position();
  Array.from(map.asteroids.values()).reduce((a, v) => {
    const testP = new Position();
    testP.fromXYCoords(v);
    const viewable = sensorCount(testP, map);
    if (a < viewable) {
      p = testP;
      return viewable;
    } else {
      return a;
    }
  }, 0);

  return p;
}
function getAngle(center: Position, target: Position): number {
  const relX = target.x - center.x;
  const relY = target.y - center.y;

  let degrees = (Math.atan2(relX, -relY) * 180) / Math.PI;
  if (degrees < 0) {
    degrees += 360;
  }
  return degrees;
}

function shootAsteroids(pos: Position, map: StarMap, num: number): Position {
  const angles = new Map<number, Position[]>();
  map.asteroids.forEach(v => {
    const p = new Position();
    p.fromXYCoords(v);
    const angle = getAngle(pos, p);
    if (!angles.has(angle)) {
      angles.set(angle, []);
    }

    const list = angles.get(angle) as Array<Position>;
    list.push(p);
    list.sort((a, b) => {
      const aDist = Math.abs(a.x - pos.x) + Math.abs(a.y - pos.y);
      const bDist = Math.abs(b.x - pos.x) + Math.abs(b.y - pos.y);
      return aDist - bDist;
    });
  });

  let removed = 0;
  let result = new Position();
  while (angles.size > 0) {
    const orderedAngles = Array.from(angles.keys()).sort((a, b) => a - b);

    orderedAngles.forEach(a => {
      const asteroids: Position[] = angles.get(a) as Position[];
      const lastPos = asteroids.shift();
      removed++;
      if (removed === num) {
        result = lastPos as Position;
      }

      if (asteroids.length === 0) {
        angles.delete(a);
      }
    });
  }

  return result;
}

function tests() {
  console.log('----running tests-----');

  let sampleData: string[] = readFile(__dirname + '/sample1.txt')[0].split(
    '\n'
  );

  let aList = loadMap(sampleData);
  chai.assert.isTrue(aList.asteroids.has('1,0'));
  chai.assert.isTrue(aList.asteroids.has('2,2'));
  chai.assert.isTrue(aList.asteroids.has('3,4'));
  chai.assert.equal(sensorCount(new Position(1, 0), aList), 7);
  chai.assert.equal(sensorCount(new Position(2, 2), aList), 7);
  chai.assert.equal(sensorCount(new Position(0, 2), aList), 6);
  chai.assert.equal(sensorCount(new Position(4, 2), aList), 5);

  chai.assert.deepEqual(bestLocation(aList), new Position(3, 4));

  sampleData = readFile(__dirname + '/sample2.txt')[0].split('\n');
  aList = loadMap(sampleData);
  chai.assert.deepEqual(
    shootAsteroids(new Position(8, 3), aList, 1),
    new Position(8, 1)
  );

  chai.assert.deepEqual(
    shootAsteroids(new Position(8, 3), aList, 6),
    new Position(11, 1)
  );
  console.log('----tests complete----');
}

tests();

//console.log(strData);
const myMap = loadMap(strData);
const sensorP = bestLocation(myMap);
console.log(sensorCount(sensorP, myMap));
console.log(shootAsteroids(sensorP, myMap, 200));
