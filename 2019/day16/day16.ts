import chai from 'chai';

const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}
const runData =
  '59749012692497360857047467554796667139266971954850723493205431123165826080869880148759586023048633544809012786925668551639957826693687972765764376332866751104713940802555266397289142675218037547096634248307260671899871548313611756525442595930474639845266351381011380170903695947253040751698337167594183713030695951696818950161554630424143678657203441568388368475123279525515262317457621810448095399401556723919452322199989580496608898965260381604485810760050252737127446449982328185199195622241930968611065497781555948187157418339240689789877555108205275435831320988202725926797165070246910002881692028525921087207954194585166525017611171911807360959';

const patterns = new Map<string, number[]>();
function generatePattern(element: number, size: number): number[] {
  const pID = `${size}:${element}`;
  if (patterns.has(pID)) {
    return patterns.get(pID) as number[];
  }
  const basePattern = [0, 1, 0, -1];
  let counter = 0;
  let pos = 0;
  let repeater = 0;
  const result = [];
  while (counter < size + 1) {
    result.push(basePattern[pos]);
    counter++;
    repeater++;
    if (repeater >= element) {
      repeater = 0;
      pos++;
      if (pos === basePattern.length) {
        pos = 0;
      }
    }
  }

  result.shift();
  patterns.set(pID, result);
  return result;
}

function nextPhase(num: number[]): number[] {
  return num.map((v, elem) => {
    const pattern = generatePattern(elem + 1, num.length);
    return Math.abs(num.reduce((a, n, i) => a + n * pattern[i], 0) % 10);
  });
}

function test() {
  chai.assert.deepEqual(generatePattern(1, 4), [1, 0, -1, 0]);
  chai.assert.deepEqual(generatePattern(2, 8), [0, 1, 1, 0, 0, -1, -1, 0]);

  const testNum = '12345678'.split('').map(n => Number(n));
  const phaseOne = nextPhase(testNum);
  chai.assert.deepEqual(phaseOne.join(''), '48226158');
  const phaseTwo = nextPhase(phaseOne);
  chai.assert.deepEqual(phaseTwo.join(''), '34040438');
}
console.log('running Tests');
test();

console.log('running Data');
console.time('part1');
let dataNums = runData.split('').map(n => Number(n));
let i = 1000;
while (i < 100) {
  dataNums = nextPhase(dataNums);
  i++;
}
const resultOne = dataNums.join('');
console.log(resultOne.substr(0, 8));
console.timeEnd('part1');

console.log('part 2');
console.time('part2');

const offset = Number(runData.substr(0, 7));
let bigData = '';
i = 0;
while (i < 10000) {
  bigData += runData;
  i++;
}
//console.log(offset, bigData.length);

function bigDataPhase(num: number[]): number[] {
  const newNums: number[] = [];
  let counter = num.length - 1;
  let acc = 0;
  while (counter > -1) {
    acc += num[counter];
    newNums.push(acc % 10);
    counter--;
  }

  return newNums.reverse();
}

const smallerData = bigData.substr(offset);
dataNums = smallerData.split('').map(n => Number(n));
i = 0;
while (i < 100) {
  dataNums = bigDataPhase(dataNums);
  i++;
}
const resultTwo = dataNums.join('');
console.log(resultTwo.substr(0, 8));
console.timeEnd('part2');
