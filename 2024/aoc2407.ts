import { expect } from 'earl';
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

//Globals

function reset() {
  //Reset Globals here
}

function findSolution(target: number, numbers: number[], part = 1):number {
  if (numbers.length === 1) return (numbers[0] === target) ? target : 0;

  const nextNum = numbers.shift();
  const a1 = Array.from(numbers);
  
  a1[0] = a1[0] + nextNum;
  let r = findSolution(target, a1, part);
  if (r !== 0 ) return r;
  
  const a2 = Array.from(numbers);
  a2[0] = a2[0] * nextNum;
  r = findSolution(target,a2, part)
  if (r !== 0 ) return r;
  if(part === 2) {
    const a3 = Array.from(numbers);
    a3[0] = parseInt(nextNum.toString() + a3[0].toString());
    r = findSolution(target, a3, part)
    if (r !== 0 ) return r;
  }
  
  return 0;
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();

  let answer: number | string = 0;
  answer = inputs.reduce((a,v) => {
    const n = v.split(":")
    return a + findSolution(parseInt(n[0]), n[1].trim().split(' ').map(c => parseInt(c)), part);
  }, 0);

  //console.log(inputs);
  //console.log(additionalInfo);
  //throw new Error("Not implemented"); // <-- Replace with your solution
  return answer;
}

run(__filename, solve);
