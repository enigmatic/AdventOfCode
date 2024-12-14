import { expect } from 'earl';
import { run } from "aoc-copilot";
import { Position

 } from '../lib/AdventOfCode';
import { printInput } from './aoc2406';
const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

//Globals
const antiNodes = new Set<string>();
const nodeMap = new Map<string, Position[]>();
let maxX = 0;
let maxY = 0;

function reset() {
  //Reset Globals here
  antiNodes.clear();
  nodeMap.clear();
}

function printResult(inputs:string[]){
  for (let y = 0; y < inputs.length; y ++) {
    let pString = `${inputs[y]}`
    for (let x = 0; x < inputs[0].length; x++ ){
      if (antiNodes.has(`${x},${y}`) && pString[x] === '.') {
        pString = pString.slice(0,x) + '#' + pString.slice(x+1) 
      }
    }
    log(pString)
  } 
}

function addAntiNode(x: number, y: number): boolean{
  if (x < 0 || x > maxX || y < 0 || y > maxY) return false;
  antiNodes.add(`${x},${y}`);
  return true;
}

function findAntiNodes(inputs: string[], part: number = 1){
  for (let y = 0; y < inputs.length; y ++) {
    for (let x = 0; x < inputs[0].length; x++ ){
      const node = inputs[y][x];
      const nodePos = new Position(x,y);
      if (node !== '.') {
        if (nodeMap.has(node)){
          nodeMap.get(node).forEach(other => {
            if (part === 1) {
              let antiX = nodePos.x + (other.x - nodePos.x) * 2;
              let antiY = nodePos.y + (other.y - nodePos.y) * 2;
              addAntiNode(antiX, antiY);
              
              antiX = nodePos.x - (other.x - nodePos.x);
              antiY = nodePos.y - (other.y - nodePos.y);
              addAntiNode(antiX, antiY);
            } else {
              let deltaX = other.x - nodePos.x;
              let deltaY = other.y - nodePos.y;
              let simplify = Math.min(Math.abs(deltaX), Math.abs(deltaY));
              while(deltaX % simplify !== 0 || deltaY % simplify !== 0){
                simplify--;
              }
              deltaX = deltaX / simplify;
              deltaY = deltaY / simplify;

              let step = 0
              let dir1 = addAntiNode(nodePos.x + deltaX * step, nodePos.y + deltaY * step);
              let dir2 = addAntiNode(nodePos.x - deltaX * step, nodePos.y - deltaY * step);
              while(dir1 || dir2) {
                      dir1 = addAntiNode(nodePos.x + deltaX * step, nodePos.y + deltaY * step);
                      dir2 = addAntiNode(nodePos.x - deltaX * step, nodePos.y - deltaY * step);
                      //log(`${nodePos}:${other} - step ${step}`)
                      //printResult(inputs)
                      //log('--------')
                      step++;
                    }
            }
          });
          
        } else {
          nodeMap.set(node, [])
        }
        nodeMap.get(node).push(nodePos);
      }
    }
  }
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();
  maxY = inputs.length - 1;
  maxX = inputs[0].length - 1;

  let answer: number | string = 0;

  findAntiNodes(inputs, part);
  answer = antiNodes.size;

  if (part === 2) {
    //printResult(inputs)
  }
  //console.log(inputs);
  //console.log(additionalInfo);
  //throw new Error("Not implemented"); // <-- Replace with your solution
  return answer;
}

run(__filename, solve);
