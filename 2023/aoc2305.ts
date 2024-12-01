import chai from "chai";
import { run } from 'aoc-copilot';

const debug = true;
function log(text:string): void {
    if (debug) {
        console.log(text);
    }
}
class NumberMap {
  source:number;
  dest:number;
  length:number;

  constructor(source: number, dest: number, length: number) {
    this.source = source;
    this.dest = dest;
    this.length = length;
  }

  get offset() {
    return this.source - this.dest;
  }

  get reverseOffset() {
    return this.dest - this.source;
  }
}

class NumberConverter {
  map: Array<NumberMap> = []
  constructor() {
  }
  clear(){
    this.map = [];
  }

  addMap(source: number, dest: number, length: number) {
    this.map.push(new NumberMap(source, dest, length));
  }

  getNumber(num: number): number{
    let c = this.map.reduce((p, v) => {
      if (v.dest <= num && (p === null || v.dest > p.dest)) {
        return v;
      } else {
        return p;
      }
    }, null);
  
    if (c !== null && (c.dest <= num && c.dest + c.length >= num)) {
      return num + c.offset;
    } else {
      return num;
    }
  }

  getSource(num:number): number {
    let c = this.map.reduce((p, v) => {
      if (v.source <= num && (p === null || v.source > p.source)) {
        return v;
      } else {
        return p;
      }
    }, null);
  
    if (c !== null && (c.source <= num && c.source + c.length > num)) {
      return num + c.reverseOffset;
    } else {
      return num;
    }
  }
}

const testMap = new NumberConverter();
testMap.addMap( 50, 98, 2);
testMap.addMap( 52, 50, 48);

chai.expect(testMap.getNumber(98)).to.eq(50);
chai.expect(testMap.getNumber(99)).to.eq(51);
chai.expect(testMap.getNumber(53)).to.eq(55);
chai.expect(testMap.getNumber(5)).to.eq(5)

chai.expect(testMap.getSource(50)).to.eq(98);
chai.expect(testMap.getSource(51)).to.eq(99);
chai.expect(testMap.getSource(55)).to.eq(53);
chai.expect(testMap.getSource(5)).to.eq(5)

let seeds:Array<number> = [];
let seedOffset:Array<number> = [];

const seedToSoil = new NumberConverter();
const soilToFertilizer = new NumberConverter();
const fertilizerToWater = new NumberConverter();
const waterToLight = new NumberConverter();
const lightToTemperature = new NumberConverter();
const temperatureToHumidity = new NumberConverter();
const humidityToLocation = new NumberConverter();

function reset(){
  seeds = [];
  seedOffset = [];
  seedToSoil.clear();
  soilToFertilizer.clear();
  fertilizerToWater.clear();
  waterToLight.clear();
  lightToTemperature.clear();
  temperatureToHumidity.clear();
  humidityToLocation.clear();
  
}

var inputMap = new Map<string, NumberConverter>();
inputMap.set('seed-to-soil', seedToSoil);
inputMap.set('soil-to-fertilizer',soilToFertilizer);
inputMap.set('fertilizer-to-water', fertilizerToWater);
inputMap.set('water-to-light', waterToLight);
inputMap.set('light-to-temperature', lightToTemperature);
inputMap.set('temperature-to-humidity', temperatureToHumidity);
inputMap.set('humidity-to-location', humidityToLocation);

let currentMap: NumberConverter = seedToSoil;

function loadSeeds(lineOne: string) {
  seeds = Array.from(lineOne.split(':')[1].trim().split(/\s+/).map(v => parseInt(v)));
}

function loadSeedsPart2(lineOne: string) {
  let seedNums = Array.from(lineOne.split(':')[1].trim().split(/\s+/).map(v => parseInt(v)));
  let s = 0;
  while (s < seedNums.length) {
    let start = seedNums[s]
    seeds.push(seedNums[s]);
    seedOffset.push(seedNums[s+1]);
    s += 2;
  }
}

function validSeed(num: number):boolean {
  return seeds.some((v, i)=> {
    return v <= num && v + seedOffset[i] > num;
  });
}

seeds = [5, 3];
seedOffset = [2, 1];
chai.expect(validSeed(2)).to.be.false;
chai.expect(validSeed(3)).to.be.true;
chai.expect(validSeed(4)).to.be.false;
chai.expect(validSeed(5)).to.be.true;
chai.expect(validSeed(6)).to.be.true;
chai.expect(validSeed(7)).to.be.false;

function seedFromLocation(location: number): number {
  if (location === 46) debugger;
  let step = location;
  step = humidityToLocation.getSource(step);
  step = temperatureToHumidity.getSource(step);
  step = lightToTemperature.getSource(step);
  step = waterToLight.getSource(step);
  step = fertilizerToWater.getSource(step);
  step = soilToFertilizer.getSource(step);
  step = seedToSoil.getSource(step);
  return step;
}

async function solve(
    inputs: string[], // Contents of the example or actual inputs
    part: number,     // Indicates whether the solver is being called for part 1 or 2 of the puzzle
    test: boolean,    // Indicates whether the solver is being run for an example or actual input
    additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
    reset();
    let answer: number | string = 0;

    //console.log(inputs);
    //console.log(additionalInfo);

    if (part === 1) {
      loadSeeds(inputs[0]);
    } else {
      loadSeedsPart2(inputs[0]);
    }
    let l = 1;
    while(l < inputs.length) {
      let line = inputs[l];
      if (line.length > 0) {
        if (line.includes('map')) {
          const key = line.split(/\s+/)[0];
          log(`loading ${key}`);
          currentMap = inputMap.get(key);
        } else {
          const values = line.split(/\s+/).map(v=>parseInt(v));
          currentMap.addMap(values[0], values[1], values[2]);
        }
      }
      l++;
    }

    if (part === 1) {
      let locations = 
      seeds.map(v => seedToSoil.getNumber(v))
            .map(v => soilToFertilizer.getNumber(v))
            .map(v => fertilizerToWater.getNumber(v))
            .map(v => waterToLight.getNumber(v))
            .map(v => lightToTemperature.getNumber(v))
            .map(v => temperatureToHumidity.getNumber(v))
            .map(v => humidityToLocation.getNumber(v));

      locations.sort((a,b)=>{
        return a - b
      });
      return locations[0];
    } else {
      let location = 0
      while (location <= 457535844) {
        let s = seedFromLocation(location)
        if (validSeed(s)) {
          return location;
        }
        location++;
      }
    }
}

run(__filename, solve);
