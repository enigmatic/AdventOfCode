import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/sample.txt');
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

const dinerMap = new Map<string, number>();
const maxHappy = new Map<string, SeatingOrder>();
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
  dinerMap.set(name + neighbor, happy);
  diners.add(name);
  diners.add(neighbor);
});

function findMaxHappy(dinerList: string[]): SeatingOrder {
  const hashStr = dinerList.sort().join('');
  console.log(`${hashStr}`);
  if (maxHappy.has(hashStr)) {
    return maxHappy.get(hashStr) as SeatingOrder;
  }
  const best = new SeatingOrder();
  if (hashStr.length === 2) {
    const p1 = Number(dinerMap.get(hashStr));
    const p2 = Number(
      dinerMap.get(
        hashStr
          .split('')
          .reverse()
          .join('')
      )
    );
    best.order = hashStr;
    best.happiness = p1 + p2;
    maxHappy.set(hashStr, best);
    console.log(`${hashStr}:${best.happiness}(${best.order})`);
    return best;
  }

  const myMaxHappy = dinerList.reduce((max, value) => {
    const happyOrder = findMaxHappy(dinerList.filter(v => v !== value));
    let happy = happyOrder.happiness;
    const first = happyOrder.order.charAt(0);
    const last = happyOrder.order.charAt(happyOrder.order.length - 1);
    happy += Number(dinerMap.get(value + first));
    happy += Number(dinerMap.get(first + value));
    happy += Number(dinerMap.get(last + value));
    happy += Number(dinerMap.get(value + last));
    happy -= Number(dinerMap.get(last + first));
    happy -= Number(dinerMap.get(first + last));

    if (happy > max.happiness) {
      max.order = value + happyOrder.order;
      max.happiness = happy;
      console.log(`${hashStr}:${max.happiness}(${max.order})`);
    }
    return max;
  }, new SeatingOrder());

  maxHappy.set(hashStr, myMaxHappy);
  console.log(
    `${hashStr} + ':' + ${myMaxHappy.happiness}(${myMaxHappy.order})`
  );
  return myMaxHappy;
}

console.log('running Data');
console.time('part1');
const bestOrder = findMaxHappy(Array.from(diners.keys()));
console.log(bestOrder.happiness);

console.timeEnd('part1');

console.log('part 2');
console.time('part2');

console.timeEnd('part2');
