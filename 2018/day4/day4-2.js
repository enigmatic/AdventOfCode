const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day4.input");
var data = buffer.toString().split('\r\n');

const parseDate = function(dateStr) {
  var bits = dateStr.split(' ');
  var day = bits[0].split('-');
  var time = bits[1].split(':');
  return new Date(day[0],day[1]-1, day[2],time[0],time[1]);
}

const parseLine = function(line, lastGuard) {
  var bits = line.split(']');
  var asleep = line.search('asleep') > 0;
  var guardPos = line.search('Guard');
  var guard = lastGuard;
  if (guardPos > -1) {
    guard = parseInt(line.substring(guardPos + 7))

  }

  var pDate = parseDate(bits[0].substring(1))
  return {
    original : line, 
    time : pDate,
    minute : pDate.getMinutes(),
    guard : guard,
    asleep : asleep
  }
}

var lastGuard = -1;
var parsedData = [];
for (i in data) {
  var parsed = parseLine(data[i], lastGuard);
  lastGuard = parsed.guard;
  parsedData.push(parsed);
}

parsedData.sort(function(a,b){ return a.time>b.time ? 1 : a.time<b.time ? -1 : 0;});
sleepingData = [];

for (i = 0; i < parsedData.length; i++) {
  if (parsedData[i].asleep) {
    var data = parsedData[i];
    var endMinute = parsedData[i+1].minute;
    if (parsedData[i].time > parsedData[i+1].time ) {
      endMinute = 60;
    }
    var sleepTime = {
      guard: data.guard,
      start: parsedData[i].time,
      end: parsedData[i+1].time,
      startMinute: parsedData[i].minute,
      endMinute: endMinute
    }
    sleepTime.length = sleepTime.endMinute - sleepTime.startMinute;
    sleepingData.push(sleepTime);
  }
}
sleepTime = {};
sleepHours = {};

for (i in sleepingData) {
  var data = sleepingData[i];
  var guard = data.guard;
  if (!sleepTime.hasOwnProperty(guard)) {
    sleepTime[guard] = 0;
    sleepHours[guard] = {};
  }
  sleepTime[guard] += data.length;
  for (i = data.startMinute; i < data.endMinute; i++){
    if (!sleepHours[guard].hasOwnProperty(i)) {
      sleepHours[guard][i] = 0;
    }
    sleepHours[guard][i] += 1;
  }
}

var bestMinute = 0;
var bestGuard = 0;
var maxDays = 0;
for (guard in sleepHours){
  
  var guardSleepSchedule = sleepHours[guard]
  for (i in guardSleepSchedule ) {
    if (guardSleepSchedule[i] >= maxDays) {
      bestMinute = i;
      bestGuard = guard;
      maxDays = guardSleepSchedule[i];
    }
  }
}

console.log('Guard : ' + bestGuard); 
console.log("Best Minute: " + bestMinute);

console.log("Hash:" + (bestMinute * bestGuard));