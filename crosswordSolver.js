const {cleanGrid} = require('./funcs/helpers');
const {parsePuzzle, findSlots} = require('./funcs/parseAndList.js');
const {solve} = require('./funcs/solve.js');
function crosswordSolver(puzzleString, words) {
  // Validate inputs
  if (typeof puzzleString !== 'string' || !Array.isArray(words)) {
    console.log('Error');
    return;
  }

  // Parse puzzle
  const grid = parsePuzzle(puzzleString.trim());
  if (!grid) {
    console.log('Error');
    return;
  }

  // Count expected words by 1 and 2
  let expectedWordCount = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        expectedWordCount++;
      } else if (grid[r][c] === '2') {
        expectedWordCount += 2;
      }
    }
  }

  // Find slots
  const slots = findSlots(grid);
  
  // Clean grid
  cleanGrid(grid);

  // Validate slot count and expected words
  if (slots.length !== words.length || expectedWordCount !== words.length) {
    console.log('Error');
    return;
  }

  // Check for duplicate words
  const uniqueWords = new Set(words);
  if (uniqueWords.size !== words.length) {
    console.log('Error');
    return;
  }

  // Prepare for solving
  const used = Array(words.length).fill(false);
  const solutions = [];

  solve(grid, slots, words, used, 0, solutions);

  // Output result
  if (solutions.length === 1) {
    const finalGrid = solutions[0];
    const result = finalGrid.map(row => row.join("")).join("\n");
    console.log(result);
  } else {
    console.log("Error");
  }
}
// const puzzle1 = '2001\n0..0\n1000\n0..0'
// const words1 = ['casa', 'alan', 'ciao', 'anta']

const puzzle2 = `
...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words2 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]

crosswordSolver(puzzle2, words2);
