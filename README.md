## structur

## first thing is split the work in the crossword solver

## phase 1: parse the gird empty puzzle from string to 2D array 

from:
const emptyPuzzle = `2001\n0..0\n1000\n0..0`
to:
[
    ['2','0','0','1'],
    ['0','.','.','0'],
    ['1','0','0','0'],
    ['0','.','.','0'],
]

## pase 2: create a list of all valid words

a slot will be represented as an object like

{
    row: 0,
    col: 0,
    dir: down | accross,
    len: 4,
}

i have to scan the grid so i can check that as a list valid or not
to do that i will use the backtrcking

## phase 3: backtracking solver

.try placing a word into a slot
.at eash step try a word in a slot
.if its fit that word no confliction, then ill go deeper into the grid
.if stuck ill use backtracking to go back
.if find one valid soloution good, if find multiple or no soloution then 'Error'

syntax of it will be somthing like

solve(grid, slot, wordlist, usedwords, slotindex, solutions)

## phase 4: place the valid words into the slot

placing all the valid words and print them
probably using helper functions





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


15/13

...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....





// grid: our working puzzle grid (modified during solving)

// slots: list of all slots (from findSlots)

// words: the full word list

// used: array of true/false flags → word at index i is used?

// index: which slot we're working on (start at 0)

// solutions: an array to store successful solutions