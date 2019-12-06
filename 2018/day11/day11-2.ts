console.time('day11');
import readFile from '../lib/readFile';
const log = (message:any, ... optional:any[]) => {
  if (true)
    console.log(message, optional);
}

let sn = 5153;

var data:string[] = readFile(__dirname + '\\input.txt');

const powerLevel = (x:number,y:number):number=>{
  let id = x + 10;
  
  let pl = id * y;
  pl += sn;
  pl = pl * id;
  //console.log(pl);
  if (pl < 100) {
    return -5;
  } else {
    let numStr = pl.toString();
    //console.log(numStr.substr(numStr.length-3, 1));
    return parseInt(numStr.substr(numStr.length-3,1)) - 5;
  }
}

let values:number[][] = new Array(301);
for (let a = 0; a < values.length; a++){
  values[a] = new Array(301).fill(0);
}

var maxFuel = 0;
var maxFuelX = 0;
var maxFuelY = 0;
var maxFuelSize = 0;

for (let x:number = 300; x > 0; x--){
  for (let y:number = 300; y > 0; y--){
    values[x][y] = powerLevel(x,y);

    var largestSize = Math.min(301-x,301-y);
    for (let s = 1; s < largestSize; s++) {
      let v = 0;
      for (let xd = 0; xd < s; xd++) {
        for (let yd = 0; yd < s; yd++) {
          v += values[x + xd][y+yd];
        }
      }
      
      if (v > maxFuel) {
        maxFuel = v;
        maxFuelX = x;
        maxFuelY = y;
        maxFuelSize = s;
      }
    }
  }
}
console.log(maxFuel, maxFuelX, maxFuelY, maxFuelSize);

console.timeEnd('day11');