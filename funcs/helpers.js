function canPlace(grid, word, slot) {
  const { row, col, dir, length } = slot;

  if (word.length !== length) {
    return false;
  }

  for (let i = 0; i < length; i++) {
    const r = dir === 'across' ? row : row + i;
    const c = dir === 'across' ? col + i : col;

    const cell = grid[r][c];

    //check if they share saame letter
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

function cleanGrid(grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] >= '1' && grid[r][c] <= '9') {
        grid[r][c] = '0';
      }
    }
  }
}


module.exports = {
  cleanGrid,
  canPlace,
  placeWord,
  removeWord
};
