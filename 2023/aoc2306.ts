import chai from "chai";
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

class RaceInfo {
  time: number;
  distance: number;

  constructor(time: number, dist: number) {
    this.time = time;
    this.distance = dist;
  }
}

let races: Array<RaceInfo> = [];

function reset() {
  //Reset Globals here
  races = [];
}

function loadData(input: string[]){
  chai.expect(input.length).to.eq(2);

  let times = input[0].split(/\s+/);
  let dists = input[1].split(/\s+/);
  chai.expect(times.length).to.eq(dists.length)
  for (let i = 1; i < times.length; i++){
    races.push(new RaceInfo(parseInt(times[i]), parseInt(dists[i])));
  }
}

function raceOptions(race: RaceInfo): number {
  // y = x (-x+t) - d
  // y = -x^x + t * x - d
  // z = Math.sqrt(t*t - 4 * d)
  //  start = (-t+z)/-2

  let z = Math.sqrt(race.time*race.time - 4 * (race.distance+0.00000001));
  let start = Math.ceil(-(-race.time+z)/2);
  let end = Math.floor(-(-race.time-z)/2);
  return end - start + 1;
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();
  let answer: number | string = 1;

  console.log(inputs);
  console.log(additionalInfo);

  if (part === 1) {

    loadData(inputs);

    answer = races.reduce((a, v)=>{
      return raceOptions(v) * a;
    }, answer);

    //throw new Error("Not implemented"); // <-- Replace with your solution
    return answer;
  } else {
    let times = inputs[0].split(/\s+/);
    let dists = inputs[1].split(/\s+/);
    times.shift();
    dists.shift();
    let time = parseInt(times.join(''));
    let dist = parseInt(dists.join(''));
    let race = new RaceInfo(time, dist);
    return raceOptions(race);
  }

}

run(__filename, solve);
