import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\day7.input');
var debug = false;

let baseCost = 60;
let maxWorkers = 5;

class Step {
  step:string = '';
  before:string[] = [];
}

class Worker{
  step:string = '';
  timeLeft = 0;
}

var steps:any = {};
var requiredList:any = {};
var candidates: string[] = []

data.forEach( line => {
  let stepPos = line.search(/Step [A-Z]/);
  let step = line.substr(stepPos+5,1);

  let reqPos = line.search(/step [A-Z]/);
  let req = line.substr(reqPos+5,1);

  if (!(step in steps)){
    let s:Step = {
      step : step,
      before: []
    }
    steps[step] = s;
  }

  steps[step].before.push(req);

  if (!(req in requiredList)) {
    requiredList[req] = []
  }
  requiredList[req].push(step);

  let checkCandidate = candidates.indexOf(req);
  if (checkCandidate != -1) {
    candidates.splice(checkCandidate,1);
  }

  if (!(step in requiredList) && candidates.indexOf(step) == -1) {
    candidates.push(step);
  }

})


let stepList = '';
let totalTime = 0;
let baseValue = 'A'.charCodeAt(0) - 1;
let workers:Worker[] = [];

while (candidates.length > 0 || workers.length > 0) {
  candidates.sort();

  let completed:string[] = [];

  while (workers.length < maxWorkers && candidates.length > 0) {
    var nextStep:string = candidates.shift() as string;
    workers.push({
      step: nextStep,
      timeLeft: nextStep.charCodeAt(0) - baseValue + baseCost
    })
  }

  workers.sort((a,b) => a.timeLeft - b.timeLeft);

  if (debug) console.log(workers);

  let worker = workers.shift() as Worker;

  let timeTaken = worker.timeLeft;
  totalTime += timeTaken;
  completed.push(worker.step);

  workers.forEach((worker,idx) => {
    worker.timeLeft -= timeTaken;
    if (worker.timeLeft === 0) {
      completed.push(worker.step);
      workers.splice(idx, 1);
    }
  })

  completed.sort();
  completed.forEach(nextStep => {

    stepList += nextStep;
    if (debug) console.log(nextStep);
    if (nextStep in steps) {

      let preReqList: Array<string> = steps[nextStep].before;
      if (debug) console.log(nextStep, preReqList);

      preReqList.forEach(step => {
        let i = requiredList[step].indexOf(nextStep);
        if (i === -1) {
          console.log('error!!!!');
        }
        requiredList[step].splice(i,1);
        if (requiredList[step].length === 0) {
          candidates.push(step);
        }
      });
      
    }
  });

  if (debug) console.log(candidates);
}

console.log(stepList);
console.log(totalTime);