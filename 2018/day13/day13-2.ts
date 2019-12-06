console.time('day13');

import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\input.txt');


class Train {
  facing: number = 0;
  turn: number = -1;
  x:number = 0;
  y:number = 0;
  crashed: boolean = false;
}

class Track {
  paths: number = 0;
  train:Train | null = null;
}

let drawTrack:string[] = Array(16).fill(' ');
                     //ENWS
drawTrack[3] = '\\'; //1100
drawTrack[5] = '-';  //1010
drawTrack[6] = '/';  //0110
drawTrack[9] = '/';  //1001
drawTrack[10] = '|'; //0101
drawTrack[12] = '\\'; //0011
drawTrack[15] = '+'; //1111

const draw = (t:Array<Track[]>) => {
  for(let line of t) {
    var printLine = '';
    for (let item of line) {
      if (item.train) {
        switch(item.train.facing) {
          case 0 :
            printLine += '>';
            break;
          case 1 :
            printLine += '^';
            break;
          case 2 :
            printLine += '<';
            break;
          case 3 :
            printLine += 'v';
            break;
        }
      }
      else {
        printLine += drawTrack[item.paths];
      }
    }
    console.log(printLine);
  }
}

let track:Array<Track[]> = Array(data.length);
for (let i = 0; i < data.length; i++) {
  track[i] = Array<Track>(data[0].length);
  for (let y = 0; y < data[0].length; y++)
    track[i][y] = new Track();
}

let trains:Train[] = [];

data.forEach((dataLine, idx) => {
  let trackLine = track[idx];
  trackLine.forEach((v, trackID) => {
    let train;

    switch (dataLine[trackID]) {
      case ' ':
        v.paths = 0;
        break;
      case '\\':
        if (dataLine[trackID+1] === '-' || dataLine[trackID+1] === '+' || dataLine[trackID+1] === '<' || dataLine[trackID+1] === '>') {
          v.paths = 3;
        } else {
          v.paths = 12;
        }
        break;
    
      case '/':
        if (dataLine[trackID+1] === '-' || dataLine[trackID+1] === '+' || dataLine[trackID+1] === '<' || dataLine[trackID+1] === '>') {
          v.paths = 9;
        } else {
          v.paths = 6;
        }
        break;
      case '|':
        v.paths =10;
        break;
      case '^':
        train = new Train();
        train.facing = 1;
        train.x = trackID;
        train.y = idx;
        trains.push(train)
        v.paths = 10;
        v.train = train;
        break;
      case 'v':
        train = new Train();
        train.facing = 3;
        train.x = trackID;
        train.y = idx;
        trains.push(train)
        v.paths = 10;
        v.train = train;
        break;
      case '-':
        v.paths = 5;
        break;
      case '>':
        train = new Train();
        train.facing = 0;
        train.x = trackID;
        train.y = idx;
        trains.push(train)
        v.paths = 5;
        v.train = train;
        break;
      case '<':
        train = new Train();
        train.facing = 2;
        train.x = trackID;
        train.y = idx;
        trains.push(train)
        v.paths = 5;
        v.train = train;
        break;
        
      case '+':
        v.paths = 15;
        break;
      default:
        break;
    }
  })
});

let safe = true;
let iter = 0;
let crash:number[] = []
while (safe) {
  
  //draw(track);
  iter++;
  //console.log(iter)
  trains.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  })

  let removeTrains:Train[] = [];

  for (let t = 0; t < trains.length; t++) {
    let train = trains[t];
    if (train.crashed) continue;
    let x = train.x;
    let y = train.y;
    track[y][x].train = null;
    switch(train.facing) {
      case 0:
        train.x += 1;
        break;
      case 1:
        train.y -= 1;
        break;
      case 2:
        train.x -= 1;
        break;
      case 3:
        train.y += 1;
        break;
    }
    
    x = train.x;
    y = train.y;
    let myTrack = track[y][x];

    if (myTrack.train !== null) {
      train.crashed = true;
      myTrack.train.crashed = true;
      removeTrains.push(train);
      removeTrains.push(myTrack.train);
      myTrack.train = null;
    } else {

      myTrack.train = train;

      switch (myTrack.paths) {
        case 3:  // \ 1100
          if (train.facing === 3) train.facing = 0
          if (train.facing === 2) train.facing = 1
          break;
      
        case 6:  // / 0110
          if (train.facing === 0) train.facing = 1
          if (train.facing === 3) train.facing = 2
          break;

        case 9:  // / 1001
          if (train.facing === 1) train.facing = 0
          if (train.facing === 2) train.facing = 3
          break;

        case 12: // \ 0011
          if (train.facing === 1) train.facing = 2
          if (train.facing === 0) train.facing = 3
          break;

        case 15:  // -
          train.facing -= train.turn;
          if (train.facing === 4) train.facing = 0;
          if (train.facing === -1) train.facing = 3;
          train.turn++;
          if (train.turn > 1) train.turn = -1
          break;
          
        default:
          break;
      }
    }

    

  }

  if (removeTrains.length > 0) {
    removeTrains.forEach(train => {
      trains.splice(trains.indexOf(train), 1);
    });
  }
  //console.log(trains.length);
  if (trains.length === 1) {
    safe = false;
  }
  //if (iter === 26) safe = false;
}
//results here
//draw(track);
console.log(trains[0]);
console.timeEnd('day13');