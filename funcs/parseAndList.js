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

            //check across
            if ((c === 0 || grid[r][c-1] === '.') && (c + 1 < cols && grid[r][c+1] !== '.')) { 
                // counting how long the word goes to the right 7ta it hit the end or .
                let len = 1;
                let cc = c + 1;
                while (cc < cols && grid[r][cc] !== '.') {
                    len++;
                    cc++;
                }
                slots.push({ row: r, col: c, dir: 'across', length: len });
                acrossFormed = true; //activate it to hangke 1
            }

            // Check down: must be at start (top boundary or blocked) and next cell exists and isn't blocked
            if ((r === 0 || grid[r-1][c] === '.') && (r + 1 < rows && grid[r+1][c] !== '.')) {
                // check if 111 didnt form an across
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

module.exports = {
  parsePuzzle,
  findSlots
};
