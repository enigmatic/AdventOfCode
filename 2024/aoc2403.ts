import { expect } from 'earl';
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

let doMul = true

//Globals

function reset() {
  doMul = true
  //Reset Globals here
}

function parseInput(input: string): number {
  let i = 0;
  let value = 0;
  while ( i < input.length ) {
    if (doMul && input[i] === 'm') {
      var end = input.indexOf(')', i+1);
      var mulTest = input.substring(i,end+1);
      
      var matching = mulTest.match(/mul\([0-9]+,[0-9]+\)/);
      if (matching && matching.length === 1 && matching[0].length === mulTest.length) {
        value += matching[0].match(/[0-9]+/g).map(v=>parseInt(v)).reduce((a, v)=> a*v, 1);
        i = end;
      }
    } else if (input[i] === 'd') {
      var end = input.indexOf(')', i+1);
      var doTest = input.substring(i,end+1);
      if (doMul) {
        var matching = doTest.match(/don't\(\)/);
        if (matching && matching.length === 1 && matching[0].length === doTest.length) {
          doMul = false
          i = end
        }
      } else {
        var matching = doTest.match(/do\(\)/);
        if (matching && matching.length === 1 && matching[0].length === doTest.length) {
          doMul = true;
          i = end;
        }
      }
    }
  i++;
  }

  return value;
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();

  let answer: number | string = 0;

  //console.log(inputs);
  //console.log(additionalInfo);
  //throw new Error("Not implemented"); // <-- Replace with your solution

  if (part === 1) {
    answer = inputs.reduce((mAcc, input) => {
      let muls = input.match(/mul\([0-9]+,[0-9]+\)/g);
      return mAcc + muls.reduce((a, v) => a + v.match(/[0-9]+/g).map(v=>parseInt(v)).reduce((a, v)=> a*v, 1), 0);
    }, 0);
  } else {
    
    answer = inputs.reduce( (a, input) => a + parseInput(input), 0);
  }
  return answer;
}

run(__filename, solve);
