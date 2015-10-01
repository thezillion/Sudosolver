function considerUniquePoss() {
	
	// We are down to leftover possibilities.
	// What if there are candidates for a cell, which are not candidates for any cell in the
	// same row, col and 3x3? Then that means that that candidate is the right choice for that
	// particular cell.

	var initial_solved_cells_count = solved_cells_count;

	if (solved_cells_count < 81) { // The grid should not be completely solved, for this to work

		loop_cells(function(row, col) {
			
			if (!solved(row, col)) {

				var cell = poss_grid[row][col], poss = cell.poss, search_value = -1;

				for (var i = 0; poss[i]; i++) { // Search for all possible candidates of this cell in the cells of the same row, col and 3x3

					var value = poss[i];

					for (var p = 0; p<9; p++) {

						if (!solved(row, p) && p != col) {

							search_value = poss_grid[row][p].poss.indexOf(value);
							
							if (search_value != -1) {
								break;
							}

						}

					}

					if (search_value == -1) {
						setValue(row, col, value);
						break;
					}

					search_value = -1;

					for (var q = 0; q<9; q++) {

						if (!solved(q, col) && q != row) {

							search_value = poss_grid[q][col].poss.indexOf(value);


							if (search_value != -1) {
								break;
							}

						}

					}

					if (search_value == -1) {
						setValue(row, col, value);
						break;
					}

					search_value = -1;

					var fcell = firstCell_3x3(row, col); // Start of the 3x3 corresponding to the current cell
					for (var r = fcell.row, rr = r+2; r<=rr; r++) {

						for (var s = fcell.col, ss = s+2; s<=ss; s++) {

							if (!solved(r, s) && !(r == row && s == col)) { // Miss the same cell, of course

								search_value = poss_grid[r][s].poss.indexOf(value);


								if (search_value != -1) {
									break;
								}

							}

						}

						if (search_value != -1) // breaking out if value is found
							break;

					}

					if (search_value == -1) {
						setValue(row, col, value);
						break;
					}

				}

			}

		});

	}

	var nowsolved = solved_cells_count - initial_solved_cells_count;

	console.log("Considering unique possibilities: ", (nowsolved));

	if (nowsolved > 0)
		considerUniquePoss();

}

function setValue(row, col, value) {


	poss_grid[row][col].poss = [value];
	adjustPossibilities();
	elem(row, col).classList.add("u-i"); // dark blue background for solved cells
	updateLeftovers();

}