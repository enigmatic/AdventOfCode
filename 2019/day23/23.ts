import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

const strData: string[] = ReadFile(__dirname + '/input.txt');
class IntCPU {
  runner: IntCodeRunner;
  inPackets: Array<Array<number>> = [];
  constructor(private id: number, outputCatcher: any) {
    this.runner = new IntCodeRunner(strData[0], outputCatcher);
    this.runner.addInput(id);
  }

  process() {
    const runPackets = this.inPackets;
    this.inPackets = [];
    if (runPackets.length > 0) {
      runPackets.forEach(p => {
        this.runner.addInput(p[1]);
        this.runner.addInput(p[2]);
      });
    } else {
      this.runner.addInput(-1);
    }
  }
}

class IntNetwork {
  cpus: IntCPU[] = [];

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.cpus.push(new IntCPU(i, this.outputCatcher()));
    }
    //console.log(this.line);
  }

  lastOutput: number[] = [];
  stop = false;
  needNAT = true;
  line = '';
  nat = new Set<number>();
  doubleNAT = 0;

  outputCatcher() {
    const me = this;
    let packet: number[] = [];
    return (outNum: number) => {
      me.needNAT = false;
      packet.push(outNum);
      if (packet.length === 3) {
        if (packet[0] === 255) {
          me.lastOutput = packet;
        } else {
          me.cpus[packet[0]].inPackets.push(packet);
        }
        packet = [];
      }
    };
  }

  processPackets() {
    this.needNAT = true;
    this.cpus.forEach(c => c.process());
    if (this.needNAT) {
      if (this.nat.has(this.lastOutput[2])) {
        this.stop = true;
      }
      this.nat.add(this.lastOutput[2]);
      this.doubleNAT = this.lastOutput[2];
      this.cpus[0].inPackets.push(this.lastOutput);
    }
  }
}

console.log('running Data');
console.time('part1');

const nw = new IntNetwork();
while (nw.lastOutput.length === 0) {
  nw.processPackets();
}
console.log(nw.lastOutput[2]);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');

const nwNAT = new IntNetwork();
while (!nwNAT.stop) {
  nwNAT.processPackets();
}
console.log(nwNAT.doubleNAT);
console.timeEnd('part2');
