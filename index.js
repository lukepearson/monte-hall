function r(num) {
    return Math.floor(Math.random() * num);
}
function ra(arr) {
    var selection = r(arr.length);
    return arr.slice(0)[selection];
}
function pct(num, total) {
    var percent = Math.round((num / total) * 100) / 100;
    var colour = [R, Y, G][Math.floor(percent * 3)];
    return "" + colour + percent * 100 + "% wins" + B;
}
var G = '\x1b[32m';
var Y = '\x1b[33m';
var R = '\x1b[31m';
var B = '\x1b[0m';
var NUM_DOORS = 3;
function createDoors() {
    var doors = [];
    var winner = r(NUM_DOORS);
    while (doors.length < NUM_DOORS) {
        doors.push({
            isWinner: doors.length === winner,
            isAvailable: true,
            isSelected: false,
            doorNumber: doors.length
        });
    }
    return doors;
}
function createRound(roundNum) {
    return {
        num: roundNum,
        doors: createDoors(),
        willSwitch: !!r(2),
        didWin: false
    };
}
function makeSelection(round) {
    var availableSelections = round.doors.filter(function (n) { return n.isAvailable && !n.isSelected; }).map(function (n) { return n.doorNumber; });
    var selection = ra(availableSelections);
    round.doors.forEach(function (door) {
        door.isSelected = (door.doorNumber === selection);
    });
}
function removeSelection(round) {
    var availableSelections = round.doors.filter(function (n) { return n.isAvailable && !n.isSelected && !n.isWinner; }).map(function (n) { return n.doorNumber; });
    var selection = ra(availableSelections);
    round.doors[selection].isAvailable = false;
}
function scoreRound(round) {
    round.didWin = round.doors.some(function (door) { return door.isSelected && door.isWinner && door.isAvailable; });
}
function doRound(roundNum) {
    var round = createRound(roundNum);
    makeSelection(round);
    removeSelection(round);
    if (round.willSwitch) {
        makeSelection(round);
    }
    scoreRound(round);
    return round;
}
function logResults(rounds) {
    var num = rounds.length;
    var numWins = rounds.filter(function (round) { return round.didWin; }).length;
    var numLosses = rounds.filter(function (round) { return !round.didWin; }).length;
    var switchWins = rounds.filter(function (round) { return round.didWin && round.willSwitch; }).length;
    var switchLosses = rounds.filter(function (round) { return !round.didWin && round.willSwitch; }).length;
    var switchNum = rounds.filter(function (round) { return round.willSwitch; }).length;
    var stayWins = rounds.filter(function (round) { return round.didWin && !round.willSwitch; }).length;
    var stayLosses = rounds.filter(function (round) { return !round.didWin && !round.willSwitch; }).length;
    var stayNum = rounds.filter(function (round) { return !round.willSwitch; }).length;
    console.log("\nTotal\n" + Y + "Rounds: " + num + B + " | " + G + "Wins: " + numWins + Y + " " + B + "|" + R + " Losses: " + numLosses + " " + B + "(" + pct(numWins, num) + ")\n\nSwitched door\n" + Y + "Rounds: " + switchNum + B + " | " + G + "Wins: " + switchWins + " " + B + "|" + R + " Losses: " + switchLosses + " " + B + "(" + pct(switchWins, switchNum) + ")\n\nKept door\n" + Y + "Rounds: " + stayNum + B + " | " + G + "Wins: " + stayWins + " " + B + "|" + R + " Losses: " + stayLosses + " " + B + "(" + pct(stayWins, stayNum) + ")");
}
function run(num) {
    var rounds = [];
    var roundNum = 0;
    var then = new Date().valueOf();
    console.log("Running " + num + " rounds");
    while (roundNum < num) {
        rounds.push(doRound(roundNum));
        roundNum++;
    }
    console.log("Completed in " + ((new Date().valueOf()) - then) + " ms");
    logResults(rounds);
}
run(1000000);
