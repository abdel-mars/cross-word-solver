function parsePuzzle(puzzleString) {
    if (typeof puzzleString !== 'string' || puzzleString == "") {
        return null;
    }
    const rows = puzzleString.split('\n');
    const grid = [];
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = [];
        for (let j = 0; j < row.length; j++) {
            cells.push(row[j]); //add eash char in row
        }
        grid.push(cells); //add row in the grid
    }
    //print 2d array
    return grid;
}

//phase 2 creat a list of valid works
function findSlots(grid) {
    const slots = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];

            if (cell !== '1' && cell !== '2') {
                continue;
            }

            // try to go across →
            if (c + 1 < cols && grid[r][c + 1] !== '.') {
                let len = 1;
                let cc = c + 1;

                while (cc < cols && grid[r][cc] !== '.') {
                    len++;
                    cc++;
                }

                slots.push({
                    row: r,
                    col: c,
                    dir: 'across',
                    length: len
                });
            }

            // try to go down ↓
            const isTwo = cell === '2';
            const isOneNoAcross = cell === '1' && !(c + 1 < cols && grid[r][c + 1] !== '.');

            if ((isTwo || isOneNoAcross) && r + 1 < rows && grid[r + 1][c] !== '.') {
                let len = 1;
                let rr = r + 1;

                while (rr < rows && grid[rr][c] !== '.') {
                    len++;
                    rr++;
                }

                slots.push({
                    row: r,
                    col: c,
                    dir: 'down',
                    length: len
                });
            }
        }
    }

    return slots;
}

function canPlace(grid, word, slot) {
  const { row, col, dir, length } = slot;

  if (word.length !== length) {
    return false;
  }

  for (let i = 0; i < length; i++) {
    const r = dir === 'across' ? row : row + i;
    const c = dir === 'across' ? col + i : col;

    const cell = grid[r][c];

    if (cell !== '0' && cell !== word[i]) {
      return false; // conflict
    }
  }

  return true;
}

function placeWord(grid, word, slot) {
  const { row, col, dir, length } = slot;
  const changed = [];

  for (let i = 0; i < length; i++) {
    const r = dir === 'across' ? row : row + i;
    const c = dir === 'across' ? col + i : col;

    if (grid[r][c] === '0') {
      grid[r][c] = word[i];
      changed.push([r, c]); // remember what we changed
    }
  }

  return changed;
}

function removeWord(grid, changed) {
  for (let i = 0; i < changed.length; i++) {
    const [r, c] = changed[i];
    grid[r][c] = '0';
  }
}


//******************************************************startt sojving */

function deepCloneGrid(grid) {
  return grid.map(row => row.slice());
}


function solve(grid, slots, words, used, index, solutions) {
  // Base case: all slots are filled
  if (index === slots.length) {
    solutions.push(deepCloneGrid(grid)); // clone it for saving
    return;
  }

  const slot = slots[index];

  for (let i = 0; i < words.length; i++) {
    if (used[i]) continue; // already used

    const word = words[i];

    if (canPlace(grid, word, slot)) {
      const changed = placeWord(grid, word, slot);
      used[i] = true;

      solve(grid, slots, words, used, index + 1, solutions); // go to next slot

      used[i] = false;
      removeWord(grid, changed); // backtrack
    }
  }
}

// Replace all 1 and 2 with 0
function cleanGrid(grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] >= '1' && grid[r][c] <= '9') {
        grid[r][c] = '0';
      }
    }
  }
}

function crosswordSolver(puzzleString, words) {
  // Step 1: Validate inputs
  if (typeof puzzleString !== 'string' || !Array.isArray(words)) {
    console.log('Error');
    return;
  }

  // Step 2: Clean and parse the puzzle into grid
  const grid = parsePuzzle(puzzleString);
  if (!grid) {
    console.log('Error');
    return;
  }

  
  // Step 3: Find all word slots
  const slots = findSlots(grid);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] >= '1' && grid[r][c] <= '9') {
        grid[r][c] = '0';
      }
    }
  }

  if (slots.length !== words.length) {
      console.log('Error');
      console.log("here")
      return;
    }

  // Step 4: Check for duplicate words
  const uniqueWords = new Set(words);
  if (uniqueWords.size !== words.length) {
    console.log('Error');
    return;
  }

  // Step 5: Prepare for solving
  const used = Array(words.length).fill(false);
  const solutions = [];

  solve(grid, slots, words, used, 0, solutions);

  // Step 6: Final result check
  if (solutions.length === 1) {
    const finalGrid = solutions[0];
    const result = finalGrid.map(row => row.join("")).join("\n");
    console.log(result);
  } else {
    console.log("Error");
  }
}

// const puzzle = '2001\n0..0\n1000\n0..0'
// const words = ['casa', 'alan', 'ciao', 'anta']


const puzzle = `
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
const words = [
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

// const puzzle = `..1.1..1...
// 10000..1000
// ..0.0..0...
// ..1000000..
// ..0.0..0...
// 1000..10000
// ..0.1..0...
// ....0..0...
// ..100000...
// ....0..0...
// ....0......`
// const words = [
//   'popcorn',
//   'fruit',
//   'flour',
//   'chicken',
//   'eggs',
//   'vegetables',
//   'pasta',
//   'pork',
//   'steak',
//   'cheese',
// ]

crosswordSolver(puzzle, words);
