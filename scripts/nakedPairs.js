// expandable function
// Currently only works on two member pairs

function nakedPairs() {

	if (solved_cells_count < 81) {

		nakedPairs_rows_cols();
		nakedPairs_3x3s();

	}

}

function nakedPairs_rows_cols() {

	var twos_rows = {
		0: [],
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
		7: [],
		8: []
	},
	twos_cols = {
		0: [],
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
		7: [],
		8: []
	};

	loop_cells(function(row, col) {

		if (poss_grid[row][col].poss.length == 2) {

			twos_rows[row].push(col);
			twos_cols[col].push(row);

		}

	});

	nakedPairs_exec_rows_cols(twos_rows, "rows");
	nakedPairs_exec_rows_cols(twos_cols, "cols");

}

function nakedPairs_exec_rows_cols(twos, cols_or_rows) {

	for (var i = 0; i<9; i++) {

		var j = twos[i];

		if (j.length > 1) {

			for (var k = 0, x = j.length; k<x; k++) {

				for (var l = k+1; l<x; l++) {

					if (cols_or_rows == "rows") {

						if (sameArray(poss_grid[i][j[k]].poss, poss_grid[i][j[l]].poss)) {

							var poss = poss_grid[i][j[k]].poss;
							for (var n = 0; poss[n]; n++) {

								for (var m = 0; m<9; m++) {

									if (m != j[k] && m != j[l]) {

										removePossibility(i, m, poss[n]);

									}

								}

							}

							console.log("Naked pair at row "+i+" with values "+poss_grid[i][j[k]].poss);

						}

					} else if (cols_or_rows == "cols") {

						if (sameArray(poss_grid[j[k]][i].poss, poss_grid[j[l]][i].poss)) {

							var poss = poss_grid[j[k]][i].poss;
							for (var n = 0; poss[n]; n++) {

								for (var m = 0; m<9; m++) {

									if (m != j[k] && m != j[l]) {

										removePossibility(m, i, poss[n]);

									}

								}

							}

							console.log("Naked pair at col "+i+" with values "+poss_grid[j[k]][i].poss);

						}

					}

				}

			}

		}

	}

	updateLeftovers();

}

function nakedPairs_3x3s() {

	// to be worked on

}