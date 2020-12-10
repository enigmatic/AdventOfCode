import chai from 'chai';
import { count } from 'console';
import { getLineAndCharacterOfPosition } from 'typescript';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

class HeldCount {
  color: string;
  count: number
}

class Bag {
  color: string;
  held: Array<HeldCount>
}

function loadBagMap(data:string[]):Map<string, Bag> {
  const m = new Map<string, Bag>();
  data.forEach( line => {
    const b = new Bag;
    b.color = line.substr(0, line.indexOf(' bags'));
    
    const baglist = line.split('contain')[1];
    if( baglist.match('no') ) {
      b.held = [];
    } else {
      b.held = baglist.split(',').map(b => {
        const w = b.trim().split(' ');
        const h = new HeldCount();
        h.count = parseInt(w[0]);
        h.color = w[1] + ' ' + w[2];
        return h;
      });
    }
    m.set(b.color, b);
  });
  return m;
}

function getColorCount(color:string, bags:Map<string, Bag>): number {
  
  const s = new Set<string>();

  const containers = new Map<string, Array<string>>();
  bags.forEach((bag) => {
    bag.held.forEach(held => {
      let c = containers.get(held.color)
      if (!c) {
        c = []
        containers.set(held.color, c);
      }
      c.push(bag.color);
    });
  });

  let pull: string[] = new Array(...containers.get(color));
  while (pull.length > 0) {
    const check = pull.pop();
    if (s.has(check)) continue;
    
    s.add(check);
    const heldIn = containers.get(check);
    if (heldIn) pull.push(...heldIn);
  }

  return s.size;
}

function getContainedCount(color:string, bags:Map<string, Bag>): number {
  let count = 1 + bags.get(color).held.reduce((acc, val) => acc + val.count * getContainedCount(val.color, bags), 0)
  return count;
}

function tests() {
  const bags = loadBagMap(sampleData);
  chai.expect(bags.get('light red').held).to.have.deep.members([{color: 'bright white', count: 1},{color: 'muted yellow', count: 2}]);
  chai.expect(bags.get('dotted black').held).to.be.empty;
  chai.expect(getColorCount('shiny gold', bags)).to.eq(4);
  chai.expect(getContainedCount('dark olive', bags)).to.eq(8);
  chai.expect(getContainedCount('shiny gold', bags)).to.eq(33);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
const bags = loadBagMap(strData);
console.log(getColorCount('shiny gold', bags));

console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(getContainedCount('shiny gold', bags)-1);
console.timeEnd('part2');
