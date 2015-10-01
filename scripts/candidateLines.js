// We need to label the 3x3s first
// 0: starts with 0,0
// 1: starts with 0,3
// 2: starts with 0,6
// 3: starts with 1,0
// 4: starts with 1,3
// 5: starts with 1,6
// 6: starts with 2,0
// 7: starts with 2,3
// 8: starts with 2,6

function candidateLines() {

	if (solved_cells_count < 81) { // if grid is unsolved

		var e = enumerate_3x3s();
		resolveCandidateLines_col(e);
		resolveCandidateLines_row(e);

	}

}

function enumerate_3x3s() {

	var _3x3 = {
		0: [0, 0],
		1: [0, 3],
		2: [0, 6],
		3: [3, 0],
		4: [3, 3],
		5: [3, 6],
		6: [6, 0],
		7: [6, 3],
		8: [6, 6],
	};

	var e = {
		0: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		1: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		2: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		3: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		4: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		5: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		6: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		7: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		},
		8: {
			1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
		}
	};

	// inserting instances of all nos from 1 to 9 present in each 3x3

	for (var i = 0; i<=8; i++) {
		var coord = _3x3[i];
		for (var row = coord[0], lastrow = row+2; row<=lastrow; row++) {
			for (var col = coord[1], lastcol = col+2; col<=lastcol; col++) {
				if (!solved(row, col)) {
					var cell = poss_grid[row][col], poss =  cell.poss;
					for (var x = 0; poss[x]; x++) {
						var p = poss[x];
						e[i][p].push([row, col]);
					}
				}
			}
		}
	}

	return e;
	
}

function exec_cL() {

	adjustPossibilities();
	nakedPairs();
	considerUniquePoss();

}

function resolveCandidateLines_row(e) {

	for (var i = 0; i<=8; i++) {

		// Looping through all the 3x3s
		var _3x3 = e[i];
		for (var j = 1; j<=9; j++) {
			var inst = _3x3[j], instlen = inst.length, row;
			if (instlen > 1) {
				row = inst[0][0];
				for (var k = 1; k<instlen; k++) {
					if (inst[k][0] != row) {
						break;
					}
				}
				if (k == instlen) { // If all instances of j lie in the same col
					console.log("Double pair at 3x3 "+i+" at row "+row+" with value "+j);
					update3x3(i, row, j, "row"); // Updates this column in both 3x3s except this(ith) one
				}
			} else if (instlen == 1) {
				console.log("Unique Poss at 3x3 "+i+" no "+j);
				considerUniquePoss();
			}
		}

	}

	updateLeftovers();

}

function resolveCandidateLines_col(e) {

	for (var i = 0; i<=8; i++) {

		// Looping through all the 3x3s
		var _3x3 = e[i];
		for (var j = 1; j<=9; j++) {
			var inst = _3x3[j], instlen = inst.length, col, row;
			if (instlen > 1) {
				col = inst[0][1];
				for (var k = 1; k<instlen; k++) {
					if (inst[k][1] != col) {
						break;
					}
				}
				if (k == instlen) { // If all instances of j lie in the same col
					console.log("Double pair at 3x3 "+i+" at col "+col+" with value "+j);
					update3x3(i, col, j, "col"); // Updates this column in both 3x3s except this(ith) one
				}
			} else if (instlen == 1) {
				console.log("Unique Poss at 3x3 "+i+" no "+j);
				considerUniquePoss();
			}
		}

	}

	updateLeftovers();

}

function update3x3(i, col_row, value, col_or_row) {

	// Miss ith 3x3, remove 'value' from column col in other 3x3s
	
	var _3x3_cells = {
		0: [
			[0, 0],
			[2, 2]
		],
		1: [
			[0, 3],
			[2, 5]
		],
		2: [
			[0, 6],
			[2, 8]
		],
		3: [
			[3, 0],
			[5, 2]
		],
		4: [
			[3, 3],
			[5, 5]
		],
		5: [
			[3, 6],
			[5, 8]
		],
		6: [
			[6, 0],
			[8, 2]
		],
		7: [
			[6, 3],
			[8, 5]
		],
		8: [
			[6, 6],
			[8, 8]
		]
	};

	if (col_or_row == "col") {

		var col = col_row;

		for (var row = 0; row<9; row++) {
			if (!(row >= _3x3_cells[i][0][0] && row <= _3x3_cells[i][1][0] && col >= _3x3_cells[i][0][1] && col <= _3x3_cells[i][1][1])) {
				// If this cell does not belong to the ith 3x3
				removePossibility(row, col, value);
			}
		}

	} else if (col_or_row == "row") {

		var row = col_row;

		for (var col = 0; col<9; col++) {
			if (!(row >= _3x3_cells[i][0][0] && row <= _3x3_cells[i][1][0] && col >= _3x3_cells[i][0][1] && col <= _3x3_cells[i][1][1])) {
				// If this cell does not belong to the ith 3x3
				removePossibility(row, col, value);
			}
		}

	}

	adjustPossibilities();
	considerUniquePoss();

}