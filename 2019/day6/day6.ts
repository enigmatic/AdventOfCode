import chai from 'chai';
import readFile from '../../lib/readFile';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;

class OrbitMapping {
  orbiting = new Map<string, string>();
  orbiters = new Map<string, string[]>();
  private _orbitCount = new Map<string, number>();

  constructor(map: string[]) {
    for (const v of map.values()) {
      const objects = v.split(')');
      const orbiter = objects[1]; // ORBITER is orbiting around CENTER
      const center = objects[0];
      this.orbiting.set(orbiter, center);
      if (this.orbiters.has(center)) {
        (this.orbiters.get(center) as Array<string>).push(orbiter);
      } else {
        this.orbiters.set(center, [orbiter]);
      }
    }
  }

  orbitCount(name: string): number {
    if (name === 'COM') {
      return 0;
    }
    if (this._orbitCount.has(name)) {
      return Number(this._orbitCount.get(name));
    }

    const orbiting = this.orbiting.get(name) as string;

    const oCount = 1 + this.orbitCount(orbiting);
    this._orbitCount.set(name, oCount);
    return oCount;
  }

  get totalOrbits(): number {
    let orbits = 0;
    const toCount: string[] = ['COM'];

    while (toCount.length > 0) {
      let next = toCount.pop() as string;
      if (this.orbiters.has(next)) {
        let nextOrbiters: string[] = this.orbiters.get(next) as string[];
        nextOrbiters.forEach(v => toCount.push(v));
      }
      orbits += this.orbitCount(next);
    }
    return orbits;
  }

  distance(start: string, end: string) {
    let distMap = new Map<string, number>();

    let dist = 0;
    let step: string = this.orbiting.get(start) as string;
    while (step !== 'COM') {
      step = this.orbiting.get(step) as string;
      dist++;
      distMap.set(step, dist);
    }

    dist = 0;
    step = this.orbiting.get(end) as string;
    while (step !== 'COM') {
      if (distMap.has(step)) {
        return dist + Number(distMap.get(step));
      }
      step = this.orbiting.get(step) as string;
      dist++;
    }
  }
}

function tests() {
  console.log('----running tests-----');

  let sampleData: string[] = readFile(__dirname + '\\sample1.txt');

  let oMap = new OrbitMapping(sampleData);
  chai.assert.isTrue(oMap.orbiters.has('COM'), 'need a root');
  chai.assert.isFalse(oMap.orbiting.has('COM'), 'root is not orbiting');
  chai.assert.equal(oMap.orbitCount('D'), 3);
  chai.assert.equal(oMap.orbitCount('L'), 7);

  chai.assert.equal(oMap.totalOrbits, 42);

  sampleData = readFile(__dirname + '\\sample2.txt');

  oMap = new OrbitMapping(sampleData);
  chai.assert.equal(oMap.distance('YOU', 'SAN'), 4);

  console.log('----tests complete----');
}

tests();

console.log('Building Map');
const dataMap = new OrbitMapping(strData);

console.log('Counting Orbits');
console.log(dataMap.totalOrbits);

console.log('Distance to Santa');

console.log(dataMap.distance('YOU', 'SAN'));
