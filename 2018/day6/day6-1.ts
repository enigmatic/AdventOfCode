import readFile from '../lib/readFile';
import rbush from 'rbush';
import { isDate } from 'util';
const knn = require('rbush-knn');

var data:string[] = readFile(__dirname + '\\day6.input');
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

var taxiDist = (p:Coordinate, x:number, y:number):number => {
  return Math.abs(p.x - x) + Math.abs(p.y - y)
}

if(debug) minX = 0;
if(debug) minY = 0;
if(debug) maxX = 9; 
if(debug) maxY = 9;

for (var y:number = minY; y < maxY + 1; y++){
  var picture=''
  for (var x:number = minX; x < maxX + 1; x++){
    
    var closest:Coordinate[] = knn(tree,x,y,4);
    closest = closest.sort((a,b)=>{ return taxiDist(a, x, y) - taxiDist(b, x, y)});

    var c1:Coordinate = closest[0];
    var c2:Coordinate = closest[1];

    const d1 = taxiDist(c1, x, y);
    const d2 = taxiDist(c2, x, y);

    if (d1 !== d2) {
      if (d1 < d2) {
        if(debug) picture += d1 === 0? c1.letter : c1.letter.toLowerCase();
        c1.seen += 1;
        if (x === minX || x === maxX || y === minY || y === maxY) {
          c1.infinite = true;
        }
      } else {
        
        if(debug) picture += d2 === 0? c2.letter : c2.letter.toLowerCase();
        c2.seen += 1;
        if (x === minX || x === maxX || y === minY || y === maxY) {
          c2.infinite = true;
        }
      }
    } else {
      if(debug) picture += '.'
    }
  }
  if(debug) console.log(picture);
}

var maxSeen = 0;
points.forEach(p => {
  if (!p.infinite && p.seen > maxSeen) maxSeen = p.seen;
})

console.log(maxSeen);
