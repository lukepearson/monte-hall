interface Door {
  isWinner: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  doorNumber: number;
}

interface Round {
  num: number;
  doors: Door[];
  willSwitch: boolean;
  didWin: boolean;
}

function r(num: number): number {
  return Math.floor(Math.random()*num);
}

function ra<T>(arr: T[]): T {
  const selection = r(arr.length);
  return arr.slice(0)[selection];
}

function pct(num: number, total: number): string {
  const percent = Math.round((num / total) * 100) / 100;
  const colour = [R,Y,G][Math.floor(percent * 3)];
  return `${colour}${percent * 100}% wins${B}`;
}

const G = '\x1b[32m';
const Y = '\x1b[33m';
const R = '\x1b[31m';
const B = '\x1b[0m';

const NUM_DOORS = 3;

function createDoors(): Door[] {
  const doors: Door[] = [];
  const winner = r(NUM_DOORS);
  while(doors.length < NUM_DOORS) {
    doors.push({
      isWinner: doors.length === winner,
      isAvailable: true,
      isSelected: false,
      doorNumber: doors.length,
    });
  }
  return doors;
}

function createRound(roundNum: number): Round {
  return {
    num: roundNum,
    doors: createDoors(),
    willSwitch: !!r(2),
    didWin: false,
  };
}

function makeSelection(round: Round) {
  const availableSelections = round.doors.filter(n => n.isAvailable && !n.isSelected).map(n => n.doorNumber);
  const selection = ra<Number>(availableSelections);
  round.doors.forEach((door: Door) => {
    door.isSelected = (door.doorNumber === selection);
  });
}

function removeSelection(round: Round) {
  const availableSelections = round.doors.filter(n => n.isAvailable && !n.isSelected && !n.isWinner).map(n => n.doorNumber);
  const selection = ra(availableSelections);
  round.doors[selection].isAvailable = false;
}

function scoreRound(round: Round) {
  round.didWin = round.doors.some((door: Door) => door.isSelected && door.isWinner && door.isAvailable);
}

function doRound(roundNum: number): Round {
  const round = createRound(roundNum);
  makeSelection(round);
  removeSelection(round);
  if (round.willSwitch) {
    makeSelection(round);
  }
  scoreRound(round);
  return round;
}

function logResults(rounds: Round[]) {
  const num = rounds.length;
  const numWins = rounds.filter(round => round.didWin).length;
  const numLosses = rounds.filter(round => !round.didWin).length;

  const switchWins = rounds.filter(round => round.didWin && round.willSwitch).length;
  const switchLosses = rounds.filter(round => !round.didWin && round.willSwitch).length;
  const switchNum = rounds.filter(round => round.willSwitch).length;
  
  const stayWins = rounds.filter(round => round.didWin && !round.willSwitch).length;
  const stayLosses = rounds.filter(round => !round.didWin && !round.willSwitch).length;
  const stayNum = rounds.filter(round => !round.willSwitch).length;

  console.log(`
Total
${Y}Rounds: ${num}${B} | ${G}Wins: ${numWins}${Y} ${B}|${R} Losses: ${numLosses} ${B}(${pct(numWins, num)})

Switched door
${Y}Rounds: ${switchNum}${B} | ${G}Wins: ${switchWins} ${B}|${R} Losses: ${switchLosses} ${B}(${pct(switchWins, switchNum)})

Kept door
${Y}Rounds: ${stayNum}${B} | ${G}Wins: ${stayWins} ${B}|${R} Losses: ${stayLosses} ${B}(${pct(stayWins, stayNum)})`);
}

function run(num: number) {
  const rounds = [];
  let roundNum = 0;
  const then = new Date().valueOf();
  console.log(`Running ${num} rounds`);
  while(roundNum < num) {
    rounds.push(doRound(roundNum));
    roundNum++;
  }
  console.log(`Completed in ${(new Date().valueOf()) - then} ms`);
  logResults(rounds);
}

run(1_000_000);
