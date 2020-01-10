import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

class SeatingOrder {
  order = '';
  happiness = 0;
}
getAllCases;

const dinerMap = new Map<string, number>();
const diners = new Set<string>();

strData.forEach(line => {
  if (line.length === 0) {
    return;
  }
  const words = line.split(' ');
  const name = words[0].charAt(0);
  let happy = Number(words[3]);

  const neighbor = words[words.length - 1].charAt(0);
  if (words[2] === 'lose') {
    happy = -happy;
  }

  const pair = [name, neighbor].sort().join('');
  if (dinerMap.has(pair)) {
    happy += dinerMap.get(pair);
  }

  dinerMap.set(pair, happy);
  diners.add(name);
  diners.add(neighbor);
});

function getAllCases(dinerList: string[]): string[] {
  if (dinerList.length === 1) {
    return dinerList;
  }
  return dinerList.reduce((result, value) => {
    const cases = getAllCases(dinerList.filter(v => v !== value));

    return result.concat(cases.map(v => value + v));
  }, []);
}

function findMaxHappy(dinerList: string[]): SeatingOrder {
  const myMaxHappy = getAllCases(dinerList).reduce((max, value) => {
    const happiness = value.split('').reduce((sum, seat, index, arr) => {
      let happy = 0;

      let neighbor: string;
      if (index === 0) {
        neighbor = arr[arr.length - 1];
      } else {
        neighbor = arr[index - 1];
      }

      const pair = [seat, neighbor].sort().join('');
      if (dinerMap.has(pair)) {
        happy += dinerMap.get(pair);
      }

      return sum + happy;
    }, 0);

    if (happiness > max.happiness) {
      max.happiness = happiness;
      max.order = value;
    }
    return max;
  }, new SeatingOrder());

  return myMaxHappy;
}

console.log('running Data');
console.time('part1');
const bestOrder = findMaxHappy(Array.from(diners.keys()));
console.log(bestOrder.happiness);

console.timeEnd('part1');

console.log('part 2');
console.time('part2');
const bestOrderWithMe = findMaxHappy(Array.from(diners.keys()).concat(['Y']));
console.log(bestOrderWithMe.happiness);

console.timeEnd('part2');
