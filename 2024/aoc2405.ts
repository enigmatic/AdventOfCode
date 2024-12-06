import { expect } from 'earl';
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

//Globals
const numRules = new Map<number, number[]>;

function reset() {
  //Reset Globals here
  numRules.clear();
}

function validUpdate(update: number[]): boolean {
  const numSet = new Set<number>();

  return !update.some(v => {
    if (numRules.has(v)) {
      if (numRules.get(v).some(n => numSet.has(n))) {
        return true;
      }
    }
    numSet.add(v);
  });
}

function correctOrder(update: number[]): number[] {
  const newOrder:number[] = [];
  const numSet = new Set<number>();
  update.forEach((v,i) => {
    let added = false;
    let addPos = i;
    if (numRules.has(v)) {
      numRules.get(v).forEach(n => {
        if (numSet.has(n)) {
          let nIndex = newOrder.indexOf(n);
          addPos = Math.min(nIndex, addPos);
        }
      });
    }
    numSet.add(v);
    newOrder.splice(addPos,0,v)
  });
  return newOrder;
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

  let line = 0;
  while (inputs[line].length > 0) {
    const nums = inputs[line].split('|').map(v=>parseInt(v));
    const numArr = (numRules.get(nums[0]) || []);
    numArr.push(nums[1])
    numRules.set(nums[0], numArr);
    line++;
  }

  let pages = inputs.slice(line+1).map(v=>v.split(',').map(n=>parseInt(n)))
  if (part===1) {
    pages = pages.filter(v=>validUpdate(v));
  } else {
    pages = pages.filter(v=>!validUpdate(v));
    pages = pages.map(v=>correctOrder(v));
  }
  
  answer = pages.reduce((a, v) => {
    let mid = v[Math.floor(v.length/2)];
    return a + mid;
  }, 0 )

  //throw new Error("Not implemented"); // <-- Replace with your solution
  return answer;
}

run(__filename, solve);
