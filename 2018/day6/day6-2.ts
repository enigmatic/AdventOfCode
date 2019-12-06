import readFile from '../lib/readFile';
import rbush from 'rbush';
import { isDate } from 'util';
const knn = require('rbush-knn');

var data:string[] = readFile(__dirname + '\\day6.input');
const maxDist = 10000;

var debug = false;

class Coordinate {
  x = 0;
  y = 0;
  infinite = false;
  seen = 0;
  letter:string = '';

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

function parseData(d:string) : Coordinate {
  var p:string[]  = d.split(',');
  return new Coordinate(parseInt(p[0]),parseInt(p[1]));
}

var points:Coordinate[] = [];

var minX = 10000, maxX = 0;
var minY = 10000, maxY = 0;

var tree:any = rbush(9, ['.x','.y','.x','.y']);

var letter:number = 0
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()';
data.forEach(e => {
  var p:Coordinate = parseData(e);
  
  if(debug) {
    p.letter = alphabet[letter];
    letter++;
  }
  
  if (p.x > maxX) maxX = p.x;
  if (p.x < minX) minX = p.x;
  if (p.y > maxY) maxY = p.y;
  if (p.y < minY) minY = p.y;

  points.push(p);
  tree.insert(p);
});

const  taxiDist = (p:Coordinate, x:number, y:number):number => {
  return Math.abs(p.x - x) + Math.abs(p.y - y)
}

const inZone = (pointList:Coordinate[], x:number, y:number, max:number):boolean => {
  var sum = 0;
  for (let c of pointList) {
    sum += taxiDist(c, x, y);
    if (sum >= max) {
      return false;
    }
  }

  return true;
}

if(debug) minX = 0;
if(debug) minY = 0;
if(debug) maxX = 9; 
if(debug) maxY = 9;

let zoneCount = 0;
for (var y:number = minY; y < maxY + 1; y++){
  for (var x:number = minX; x < maxX + 1; x++){
    if (inZone(points, x, y, maxDist)) {
      zoneCount += 1;
    }
  }
}

console.log(zoneCount);
