console.time('day23')

import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\input.txt');
var debug = false;


class Coordinate {
  x: number;
  y: number;
  z: number;
  r: number;
  constructor(x:number, y:number, z:number, r:number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
  }
}

var taxiDist = (a:Coordinate, b:Coordinate):number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) +  + Math.abs(a.z - b.z)
}

let cList: Coordinate[] = [];
let bigRadius:Coordinate = new Coordinate(0,0,0,0);
data.forEach(line => {
  let coordEnd = line.indexOf('>');
  let coords = line.substring(5,coordEnd).split(',').map(s => parseInt(s));
  let radius = parseInt(line.substr(coordEnd + 5));
  let c = new Coordinate(coords[0], coords[1], coords[2], radius);
  if (c.r > bigRadius.r) bigRadius = c;
  cList.push(c);
});

let inRange = 0
cList.forEach(c => {
  if (taxiDist(c, bigRadius) <= bigRadius.r) inRange++
})

console.log('part 1:', inRange);
console.timeEnd('day23')