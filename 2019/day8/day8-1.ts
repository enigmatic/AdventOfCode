import chai from 'chai';
import chalk from 'chalk';
import readFile from '../../lib/readFile';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;

function getLayers(
  strData: string,
  width: number,
  height: number
): Array<Array<number>> {
  const data = strData.split('').map(v => Number(v));

  const layers: Array<Array<number>> = [];

  let pointer = 0;
  while (pointer < data.length) {
    const layer = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        layer.push(data[pointer]);
        pointer++;
      }
    }
    layers.push(layer);
  }
  return layers;
}

function digitCounter(layers: Array<Array<number>>): number {
  let min = layers[0].reduce((a, v) => (v === 0 ? a + 1 : a), 0);
  let layer = 0;
  for (let i = 1; i < layers.length; i++) {
    const c = layers[i].reduce((a, v) => (v === 0 ? a + 1 : a), 0);
    if (c < min) {
      min = c;
      layer = i;
    }
  }
  return (
    layers[layer].reduce((a, v) => (v === 1 ? a + 1 : a), 0) *
    layers[layer].reduce((a, v) => (v === 2 ? a + 1 : a), 0)
  );
}

function drawData(layers: Array<Array<number>>, width: number, height: number) {
  let p = 0;
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      let layer = 0;
      while (layers[layer][p] === 2) {
        layer++;
      }

      if (layers[layer][p] === 0) {
        line += ' ';
      } else if (layers[layer][p] === 1) {
        line += chalk.bgWhite(' ');
      }

      p++;
    }
    console.log(line);
  }
}

function tests() {
  console.log('----running tests-----');

  const layers = getLayers('123456789012', 3, 2);

  chai.assert.equal(layers.length, 2);
  chai.assert.equal(layers[0].join(''), '123456');
  chai.assert.equal(layers[1].join(''), '789012');

  console.log('----tests complete----');
}

tests();

const bigLayers = getLayers(strData[0], 25, 6);
console.log(digitCounter(bigLayers));
drawData(bigLayers, 25, 6);
