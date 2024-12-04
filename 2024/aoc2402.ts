import { expect } from 'earl';
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}


function safeLevel(level:string, dampen:boolean = false): boolean {
  let split = level.split(/\s+/).map(v => parseInt(v));
  let increasing = split[0] < split[1];

  if (dampen) {
    for (let i = 0; i < split.length-1; i++) {
      let v = split[i];
      let n = split[i+1];
      let failed = false;

      if (Math.abs(n - v) > 3) failed = true;
      if (!failed) {
        if (increasing) {
          failed = n <= v;
        } else {
          failed = n >= v;
        }
      }

      if (failed) {
        if (i >= split.length-2) return true;
        if (i === 1 ) { //edge case: descending/ascending is wrong
          var s = Array.from(split);
          s.splice(0,1);
          if (safeLevel(s.join(' '))) return true;
          
        }
        var a = Array.from(split);
        var b = Array.from(split);
        a.splice(i, 1);
        b.splice(i+1, 1);
        return safeLevel(a.join(' ')) || safeLevel(b.join(' '));
      }
    }
    return true;
  } else {  
    return !split.some((v, i)=>{
      if (i === split.length - 1) return false;
      let n = split[i+1];
      if (Math.abs(n - v) > 3) return true;
      if (increasing) {
        return n <= v;
      } else {
        return n >= v;
      }
    });
  }
}

//Globals

function reset() {
  //Reset Globals here
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();

  let answer: number | string = 0;

  console.log(inputs);
  //console.log(additionalInfo);
  answer = inputs.reduce((a,v) => {
    if (part === 1) {
      return a + (safeLevel(v) ? 1 : 0)
    } else {
      return a + (safeLevel(v, true) ? 1 : 0)
    }

  }, 0);
  return answer;
}

run(__filename, solve);
