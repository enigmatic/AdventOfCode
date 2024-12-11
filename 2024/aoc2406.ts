import { expect } from 'earl';
import { run } from "aoc-copilot";
import { Position, directions } from '../lib/AdventOfCode';

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}
export function printInput(map: string[]){
  map.forEach(l=>log(l));
}

//Globals
const movements:Array<Array<boolean>>[] = [];
function reset() {
  //Reset Globals here
  movements.splice(0, movements.length);
}

function turnRight(dir:number){
  let newDir = dir + 1;
  if (newDir > 3) newDir = 0;
  return newDir
}

//returns 1 if it's a new step
function stepOn(line:string, p:Position, d:string): string {
  return line.substring(0,p.x) + d + line.substring(p.x+1);
}


function walkPath(map: string[], p: Position, startDir: number = 0, part: number = 1):number {
  let dir = startDir;
  let answer = 0;
  while(p.x > 0 && p.x < map[0].length - 1 &&
    p.y > 0 && p.y < map.length - 1) {
    
    if (part === 1 && map[p.y][p.x] === '.') answer++;

    map[p.y] = stepOn(map[p.y], p, 'X');
    if (movements[p.y][p.x][dir] === true) {
      return 1;
    }
    movements[p.y][p.x][dir] = true;

    let newX = p.x + directions[dir].x;
    let newY = p.y + directions[dir].y;

    if (map[newY][newX] === '#') {
      dir = turnRight(dir);
      newX = p.x + directions[dir].x;
      newY = p.y + directions[dir].y;
    }
    p.x = newX;
    p.y = newY;
  }
  return answer;
}

function testLoop(map: string[], p: Position): boolean {
  reset()
  map.forEach( line => {
    movements.push(line.split('').map(v => [false,false,false,false]));
  });
  let dir = 0;
  while(p.x > 0 && p.x < map[0].length - 1 &&
    p.y > 0 && p.y < map.length - 1) {

    let newX = p.x + directions[dir].x;
    let newY = p.y + directions[dir].y;

    if (map[newY][newX] === '#') {
      dir = turnRight(dir);
      newX = p.x + directions[dir].x;
      newY = p.y + directions[dir].y;
    }
    p.x = newX;
    p.y = newY;

    if (movements[p.y][p.x][dir] === true) {
      return true;
    }
    //map[p.y] = stepOn(map[p.y], p, 'X');
    movements[p.y][p.x][dir] = true;
  }
  return false;
}

function findLoops(map: string[], startPosition: Position): number {
  let p = startPosition.clone();
  let dir = 0;
  let answer = 0;

  const pSet = new Set<string>();
  
  
  while(p.x > 0 && p.x < map[0].length - 1 &&
    p.y > 0 && p.y < map.length - 1) {
    
    let newX = p.x + directions[dir].x;
    let newY = p.y + directions[dir].y;

    if (map[newY][newX] === '#') {
      dir = turnRight(dir);
      newX = p.x + directions[dir].x;
      newY = p.y + directions[dir].y;
    }

    p.x = newX;
    p.y = newY;
    pSet.add(p.toXYString());
  }

  pSet.forEach(v => {
    const testP = new Position();
    testP.fromXYCoords(v);

    const newMap = map.map(l => `${l}`);
    newMap[testP.y] = stepOn(newMap[testP.y], testP, '#');
    
    if (testLoop(newMap, startPosition.clone())) {
      answer++;
    }
  });
  return answer;

}


async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();
  
  inputs.forEach( line => {
    movements.push(line.split('').map(v => [false,false,false,false]));
  });

  const p = new Position()
  let answer: number | string = 0;
  let part1 = 1;
  let part2 = 0;

  //console.log(map);
  //console.log(additionalInfo);
  //throw new Error("Not implemented"); // <-- Replace with your solution

  for (let y = 0; y < inputs.length; y++) {
    let x = inputs[y].indexOf('^');
    if (x >= 0) {
      p.x = x;
      p.y = y;
      break;
    }
  }

  if (part === 1) {
    answer = walkPath(inputs.map(l => `${l}`), p) + 2; //doesn't get initial or final X
  } else {
    answer = findLoops(inputs.map(l => `${l}`), p);
  }

  // extend initial direction
  //printInput(map);

  return answer;
}

run(__filename, solve);
