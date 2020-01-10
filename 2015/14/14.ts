class Reindeer {
  distance = 0;
  points = 0;
  steps = 0;
  running = true;
  constructor(
    public name: string,
    public speed: number,
    public speedTime: number,
    public rest: number
  ) {}
}

const deer = [
  new Reindeer('Comet', 14, 10, 127),
  new Reindeer('Dancer', 16, 11, 162)
];

function raceDeer(reindeer: Reindeer[], time: number) {
  for (let i = 0; i < time; i++) {
    reindeer.forEach(d => {
      d.steps++;
      if (d.running) {
        d.distance += d.speed;
        if (d.speedTime <= d.steps) {
          d.running = false;
          d.steps = 0;
        }
      } else if (d.rest <= d.steps) {
        d.running = true;
        d.steps = 0;
      }
    });

    const maxD = reindeer.reduce((p, value) => Math.max(p, value.distance), 0);

    reindeer.forEach(d => {
      if (maxD === d.distance) {
        d.points++;
      }
    });
  }
}

raceDeer(deer, 1000);
deer.forEach(d => console.log(`${d.name} d:${d.distance} p:${d.points}`));

const input = [
  new Reindeer('Dancer', 27, 5, 132),
  new Reindeer('Cupid', 22, 2, 41),
  new Reindeer('Rudolph', 11, 5, 48),
  new Reindeer('Donner', 28, 5, 134),
  new Reindeer('Dasher', 4, 16, 55),
  new Reindeer('Blitzen', 14, 3, 38),
  new Reindeer('Prancer', 3, 21, 40),
  new Reindeer('Comet', 18, 6, 103),
  new Reindeer('Vixen', 18, 5, 84)
];
raceDeer(input, 2503);

console.log('----Distance----');

console.log(
  input.reduce((m, d) => {
    if (d.distance >= m) {
      console.log(d.name + ' ' + d.distance);
      return d.distance;
    }
    return m;
  }, 0)
);

console.log('----Points----');
console.log(
  input.reduce((m, d) => {
    if (d.points >= m) {
      console.log(d.name + ' ' + d.points);
      return d.points;
    }
    return m;
  }, 0)
);
