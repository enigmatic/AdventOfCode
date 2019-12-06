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

for (let x:number = 300; x > 0; x--){
  for (let y:number = 300; y > 0; y--){
    values[x][y] = powerLevel(x,y);

    if (x < 298 && y < 298) {
      let v = values[x][y] + 
              values[x+1][y] +
              values[x+2][y] +
              values[x][y+1] +
              values[x+1][y+1] +
              values[x+2][y+1] +
              values[x][y+2] +
              values[x+1][y+2] +
              values[x+2][y+2];
              
      if (v > maxFuel) {
        maxFuel = v;
        maxFuelX = x;
        maxFuelY = y;
      }
    }
  }
}
console.log(maxFuel, maxFuelX, maxFuelY);

console.timeEnd('day11');