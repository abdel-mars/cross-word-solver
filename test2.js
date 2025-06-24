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

// Fixed slot finding with boundary checks
function findSlots(grid) {
    const slots = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];
            if (cell !== '1' && cell !== '2') continue;

            const isTwo = cell === '2';
            let acrossFormed = false;

            // Check across: must be at start (left boundary or blocked) and next cell exists and isn't blocked
            if ((c === 0 || grid[r][c-1] === '.') && (c + 1 < cols && grid[r][c+1] !== '.')) {
                let len = 1;
                let cc = c + 1;
                while (cc < cols && grid[r][cc] !== '.') {
                    len++;
                    cc++;
                }
                slots.push({ row: r, col: c, dir: 'across', length: len });
                acrossFormed = true;
            }

            // Check down: must be at start (top boundary or blocked) and next cell exists and isn't blocked
            if ((r === 0 || grid[r-1][c] === '.') && (r + 1 < rows && grid[r+1][c] !== '.')) {
                // For '1', only form down if across wasn't formed
                if (isTwo || !acrossFormed) {
                    let len = 1;
                    let rr = r + 1;
                    while (rr < rows && grid[rr][c] !== '.') {
                        len++;
                        rr++;
                    }
                    slots.push({ row: r, col: c, dir: 'down', length: len });
                }
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

function cleanGrid(grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] >= '1' && grid[r][c] <= '9') {
        grid[r][c] = '0';
      }
    }
  }
}

// Fixed solver with proper starting cell validation
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

  // Count expected words from starting cells
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

// const puzzle = '2001\n0..0\n1000\n0..0'
// const words = ['casa', 'alan', 'ciao', 'anta']

// const puzzle = `
// ...1...........
// ..1000001000...
// ...0....0......
// .1......0...1..
// .0....100000000
// 100000..0...0..
// .0.....1001000.
// .0.1....0.0....
// .10000000.0....
// .0.0......0....
// .0.0.....100...
// ...0......0....
// ..........0....`
// const words = [
//   'sun',
//   'sunglasses',
//   'suncream',
//   'swimming',
//   'bikini',
//   'beach',
//   'icecream',
//   'tan',
//   'deckchair',
//   'sand',
//   'seaside',
//   'sandals',
// ]

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

// const puzzle = `...1...........
// ..1000001000...
// ...0....0......
// .1......0...1..
// .0....100000000
// 100000..0...0..
// .0.....1001000.
// .0.1....0.0....
// .10000000.0....
// .0.0......0....
// .0.0.....100...
// ...0......0....
// ..........0....`
// const words = [
//   'sun',
//   'sunglasses',
//   'suncream',
//   'swimming',
//   'bikini',
//   'beach',
//   'icecream',
//   'tan',
//   'deckchair',
//   'sand',
//   'seaside',
//   'sandals',
// ].reverse()

const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['aaab', 'aaac', 'aaad', 'aaae']



console.log(crosswordSolver(puzzle, words))