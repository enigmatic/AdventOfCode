import chai from "chai";
import { run } from "aoc-copilot";

const debug = false;
function log(text:string): void {
    if (debug) {
        console.log(text);
    }
}

let neighbors: Array<Array<number>> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  // [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

let schematic: Array<string> = [
    '.......',
    '....%52',
    '.36....'
];

function isEmpty(x: number, y: number): boolean {
  if (x < 0 || x >= schematic[0].length || y < 0 || y >= schematic.length) {
    return true;
  }
  return schematic[y][x] === ".";
}
chai.expect(isEmpty(-1,2)).to.be.true;
chai.expect(isEmpty( 0,2)).to.be.true;
chai.expect(isEmpty( 1,20)).to.be.true;
chai.expect(isEmpty( 5,2)).to.be.true;
chai.expect(isEmpty( 2,2)).to.be.false;
chai.expect(isEmpty( 4,1)).to.be.false;

function isSymbol(x: number, y: number): boolean {
  if (isEmpty(x, y)) return false;
  if (isNaN(parseInt(schematic[y][x]))) return true;

  return false;
}
chai.expect(isSymbol(-1,2)).to.be.false;
chai.expect(isSymbol( 0,2)).to.be.false;
chai.expect(isSymbol( 1,20)).to.be.false;
chai.expect(isSymbol( 5,2)).to.be.false;
chai.expect(isSymbol( 2,2)).to.be.false;
chai.expect(isSymbol( 4,1)).to.be.true;

function isNumber(x: number, y: number): boolean {
  if (isEmpty(x, y)) return false;
  if (isNaN(parseInt(schematic[y][x]))) return false;

  return true;
}
chai.expect(isNumber(-1,2)).to.be.false;
chai.expect(isNumber( 0,2)).to.be.false;
chai.expect(isNumber( 1,20)).to.be.false;
chai.expect(isNumber( 5,2)).to.be.false;
chai.expect(isNumber( 2,2)).to.be.true;
chai.expect(isNumber( 4,1)).to.be.false;

function isStartingNumber(x: number, y: number): boolean {
  if (!isNumber(x, y)) return false;

  if (x > 0) {
    if (isNumber(x-1,y)) {
      return false;
    }
  }

  return true;
}
chai.expect(isStartingNumber( 5,1)).to.be.true;
chai.expect(isStartingNumber( 1,2)).to.be.true;
chai.expect(isStartingNumber( 2,2)).to.be.false;

function getNumberIfPart(x: number, y: number): number {
    if (isStartingNumber(x,y)) {
        let checkX = x;
        var number = '';
        let partSymbol = false;
        while(isNumber(checkX, y)) {
            number += schematic[y][checkX];
            if (partSymbol || neighbors.some((neighbor)=>{
                return isSymbol(checkX+neighbor[0], y+neighbor[1]);
            })) {
                partSymbol = true;
            }
            checkX++;
        }
        log(`Found ${number}`)
        if (partSymbol) {
            log(`-----valid`)
            return parseInt(number);
        }
    }
    return 0;
}
chai.expect(getNumberIfPart( 5,1)).to.eq(52);
chai.expect(getNumberIfPart( 1,2)).to.eq(0);

function getGearRatio(x: number, y: number): number {
  if (schematic[y][x] !== '*') return 0;
  let numNeighbors = neighbors.filter(n => isNumber(x+n[0], y+n[1]));
  var numLocations = numNeighbors.map(n=> {
    var checkX = x+n[0];
    var checkY = y+n[1];
    while(isNumber(checkX, checkY)) {
      checkX--;
    }
    checkX++;
    return [checkX, checkY];
  });

  var numMap = new Map<string, Array<number>>();
  numLocations.forEach(v=> numMap.set(v.toString(), v));
  log(`gear test (${x}, ${y})`);
  let numberList = Array.from(numMap.values());
  if (numberList.length === 2) {
    return getNumberIfPart(numberList[0][0], numberList[0][1]) *
    getNumberIfPart(numberList[1][0], numberList[1][1]) 
  }
  return 0;
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  schematic = inputs;

  let answer: number | string = 0;

  //log(inputs);
  //log(additionalInfo);

  let maxY = schematic.length;
  let maxX = schematic[0].length;
  for( let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (part === 1) {
        answer += getNumberIfPart(x,y);
      } else {
        answer += getGearRatio(x,y);
      }
    }
  }


  return answer;
}

run(__filename, solve);
