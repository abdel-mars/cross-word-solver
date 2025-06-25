const {
  canPlace,
  placeWord,
  removeWord
} = require('./helpers');


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
module.exports = {
  solve
};
