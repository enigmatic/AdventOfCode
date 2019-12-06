import readFile from '../lib/readFile';

let strData:string[] = readFile(__dirname + '\\input.txt');
let debug = false;

let data:number[] = strData[0].split(' ').map(value => parseInt(value));

class Node {
  location:number = 0;
  children:Node[] = [];
  metadata:number[] = [];
}

let metadataSum = 0;

const parseNode = (parent:Node, data:number[], startPos:number):number => {
  let thisNode = new Node();
  thisNode.location = startPos;

  parent.children.push(thisNode);
  let numChildren = data[startPos];
  let metadata = data[startPos + 1];

  if (debug) console.log('Found node at', startPos, ':', numChildren, metadata)

  let currentPos = startPos + 2;

  for(let i = 0; i < numChildren; i++) {
    currentPos = parseNode(thisNode, data, currentPos);
  }

  for(let i = 0; i < metadata; i++) {
    metadataSum += data[currentPos];
    thisNode.metadata.push(data[currentPos]);
    currentPos++;
  }

  if (debug) console.log('Metadata for node', startPos, ':', thisNode.metadata)

  return currentPos;
}

let tree = new Node();

parseNode(tree, data, 0);

const nodeValue = (node:Node) => {
  if (node.children.length === 0) {
    return node.metadata.reduce((accumulator, value) => accumulator + value);
  }

  let value = 0;
  node.metadata.forEach(v => {
    if (v > 0 && v <= node.children.length) {
      value += nodeValue(node.children[v-1])
    }
  });

  return value;
}

console.log(metadataSum);

console.log(nodeValue(tree.children[0]));