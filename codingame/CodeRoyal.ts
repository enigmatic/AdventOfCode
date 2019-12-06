/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Site {
  id: number = -1;
  type: number = -1;
  owner: number = -1;
  x: number = -1;
  y: number = -1;
  radius: number = -1;
  gold: number = -1;
  maxMineSize: number = -1;
  p1: number = -1;
  p2: number = -1;
  built: boolean = false;
}

const numSites: number = parseInt(readline());
const siteMap: Map<number, Site> = new Map();
for (let i = 0; i < numSites; i++) {
  var inputs: string[] = readline().split(' ');
  const siteId: number = parseInt(inputs[0]);
  const x: number = parseInt(inputs[1]);
  const y: number = parseInt(inputs[2]);
  const radius: number = parseInt(inputs[3]);

  const site: Site = {
    id: siteId,
    type: -1,
    owner: -1,
    x,
    y,
    radius,
    gold: -1,
    maxMineSize: -1,
    p1: 0,
    p2: -1,
    built: false
  };
  siteMap.set(i, site);
}

let mines: Set<number> = new Set();
let towers: Set<number> = new Set();
let firstMine: number = -1;
let archerSite: number = -1;
let knightSite: number = -1;
let giantSite: number = -1;
let buildOrder: number[] = [];

let init = false;
let mySites: Site[] = [];
let lastTouch = -1;
let homeX = -1;
let homeY = -1;

// game loop
while (true) {
  let enemyTowers = false;

  var inputs: string[] = readline().split(' ');
  const gold: number = parseInt(inputs[0]);
  const touchedSite: number = parseInt(inputs[1]); // -1 if none

  for (let i = 0; i < numSites; i++) {
    var inputs: string[] = readline().split(' ');
    const siteId: number = parseInt(inputs[0]);
    const gold: number = parseInt(inputs[1]); // gold in mine
    const maxMineSize: number = parseInt(inputs[2]); // max Mining Rate
    const structureType: number = parseInt(inputs[3]); // max Mining Rate       const structureType: number = parseInt(inputs[3]); // -1 = No structure, 2 = Barracks
    const owner: number = parseInt(inputs[4]); // -1 = No structure, 0 = Friendly, 1 = Enemy
    const param1: number = parseInt(inputs[5]);
    const param2: number = parseInt(inputs[6]);

    let site = siteMap.get(siteId);
    if (site) {
      site.type = structureType;
      site.owner = owner;
      site.gold = gold;
      site.maxMineSize = maxMineSize;
      site.p1 = param1;
      site.p2 = param2;
    }

    if (owner === 1 && structureType === 1) enemyTowers = true;
  }
  const numUnits: number = parseInt(readline());
  const queen = { x: 0, y: 0 };
  let knights = 0;
  let archers = 0;
  let giants = 0;

  for (let i = 0; i < numUnits; i++) {
    var inputs: string[] = readline().split(' ');
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    const owner: number = parseInt(inputs[2]);
    const unitType: number = parseInt(inputs[3]); // -1 = QUEEN, 0 = KNIGHT, 1 = ARCHER
    const health: number = parseInt(inputs[4]);
    if (owner === 0) {
      switch (unitType) {
        case -1: {
          queen.x = x;
          queen.y = y;
          break;
        }
        case 0: {
          knights++;
          break;
        }
        case 1: {
          archers++;
          break;
        }
        case 2: {
          giants++;
          break;
        }
      }
    }
  }

  if (!init) {
    homeX = queen.x;
    homeY = queen.y;
    const sites: Site[] = [];
    for (let value of siteMap.values()) {
      sites.push(value);
    }
    mySites = sites
      .filter(site => site.owner === -1)
      .sort((s1, s2) => {
        const d1x = queen.x - s1.x;
        const d1y = queen.y - s1.y;
        const d2x = queen.x - s2.x;
        const d2y = queen.y - s2.y;

        return d1x * d1x + d1y * d1y - (d2x * d2x + d2y * d2y);
      })
      .slice(0, numSites / 2);

    firstMine = mySites[0].id;
    mines.add(firstMine);

    archerSite = mySites[1].id;

    for (let i = 2; i < numSites / 2 - 1; i++) {
      if (i < numSites / 4) mines.add(mySites[i].id);
    }

    knightSite = mySites[numSites / 2 - 1].id;

    //giantSite = targetSites[totalTargets - 2];
    //console.error(`giant Site: (${giantSite.x}, ${giantSite.y})`);

    buildOrder = [firstMine, archerSite, knightSite];

    init = true;
  }

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  let targetSites = mySites.filter(
    site => site.owner === -1 && site.id != lastTouch
  );
  console.error(buildOrder);

  let tSite: Site | undefined;
  if (touchedSite != -1) {
    tSite = siteMap.get(touchedSite) as Site;

    console.error('Touching ' + touchedSite);
  }

  if (
    tSite &&
    tSite.owner === 0 &&
    tSite.type === 0 &&
    tSite.p1 < tSite.maxMineSize
  ) {
    console.error('Improving Mine ' + touchedSite);

    console.log(`BUILD ${touchedSite} MINE`);
  } else if (tSite && tSite.owner != 0 && lastTouch !== touchedSite) {
    lastTouch = touchedSite;

    if (touchedSite === firstMine) {
      console.log(`BUILD ${touchedSite} MINE`);
      buildOrder.shift();
    } else if (touchedSite === archerSite) {
      console.log(`BUILD ${touchedSite} BARRACKS-ARCHER`);
      buildOrder.shift();
    } else if (touchedSite === knightSite) {
      console.log(`BUILD ${touchedSite} BARRACKS-KNIGHT`);
      buildOrder.shift();
    } else if (giantSite != -1 && enemyTowers && targetSites.length === 1) {
      giantSite = touchedSite;
      console.log(`BUILD ${touchedSite} BARRACKS-GIANT`);
    } else {
      if (mines.has(touchedSite)) {
        if (tSite.gold !== 0) console.log(`BUILD ${touchedSite} MINE`);
        else console.log(`BUILD ${touchedSite} TOWER`);
      } else {
        console.log(`BUILD ${touchedSite} TOWER`);
      }
    }
  } else if (targetSites.length > 0) {
    if (buildOrder.length === 0) {
      const target = { x: 960, y: 100, dist: 10000000000 };

      let nearest = targetSites.reduce((acc, site) => {
        const x = queen.x - site.x;
        const y = queen.y - site.y;
        const dist = x * x + y * y;
        if (dist < acc.dist) {
          return { x: site.x, y: site.y, dist };
        } else {
          return acc;
        }
      }, target);

      console.log(`MOVE ${nearest.x} ${nearest.y}`);
    } else {
      let nextBuild = siteMap.get(buildOrder[0]) as Site;
      console.log(`MOVE ${nextBuild.x} ${nextBuild.y}`);
    }
  } else {
    console.log(`MOVE ${homeX} ${homeY}`);
  }

  // First line: A valid queen action
  // Second line: A set of training instructions
  //console.log('WAIT');

  let cmd = 'TRAIN';
  let left = gold;
  let aSite = siteMap.get(archerSite);
  if (aSite && left >= 100 && aSite.p1 === 0 && archers < 3) {
    cmd += ` ${archerSite}`;
    left -= 100;
  }

  let gSite = siteMap.get(giantSite);
  if (gSite && left >= 140 && gSite.p1 === 0 && giants < 1) {
    cmd += ` ${giantSite}`;
    left -= 140;
  }

  let kSite = siteMap.get(giantSite);
  if (kSite && (left > 180 || (left >= 80 && kSite.p1 === 0 && knights < 6))) {
    cmd += ` ${knightSite}`;
    left -= 80;
  }

  console.log(cmd);
}
