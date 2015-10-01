function choosePossibilities() {

	// Description

	var initial_solved_cells_count = solved_cells_count;

	if (solved_cells_count < 81) { // The grid should not be completely solved, for this to work

		win.no_poss = 2;

		iter();	

	}

	console.log("Choosing possibilities: ", (solved_cells_count - initial_solved_cells_count));

}

function iter() {

	// console.log("iter ran");

	loop_cells(function(row, col) {

		var cell = poss_grid[row][col], instances, min_instances = 100, min_instances_value;
		
		if (!solved(row, col) && poss_grid[row][col].poss.length == win.no_poss) {

			var poss = cell.poss, search_value;
			instances = 0;

			for (var i = 0; poss[i]; i++) { // Search for all possible candidates of this cell in the cells of the same row, col and 3x3

				var value = poss[i];

				for (var p = 0; p<9; p++) {

					if (!solved(row, p) && p != col) {

						search_value = poss_grid[row][p].poss.indexOf(value);
						
						if (search_value != -1) {
							instances++;
						}

					}

				}

				for (var q = 0; q<9; q++) {

					if (!solved(q, col) && q != row) {

						search_value = poss_grid[q][col].poss.indexOf(value);

						if (search_value != -1) {
							instances++;
						}

					}

				}

				var fcell = firstCell_3x3(row, col); // Start of the 3x3 corresponding to the current cell
				for (var r = fcell.row, rr = r+2; r<=rr; r++) {

					for (var s = fcell.col, ss = s+2; s<=ss; s++) {

						if (!solved(r, s) && r != row && s != col) {

							search_value = poss_grid[r][s].poss.indexOf(value);

							if (search_value != -1) {
								instances++;
							}

						}

					}

				}

				console.log("instances: ", instances);

				if (instances < min_instances) {
					min_instances = instances;
					min_instances_value = value;
				}

			}

			cell.poss = [min_instances_value];
			adjustPossibilities();
			considerUniquePoss();

		}

	});

	if (win.no_poss < 9) {
		win.no_poss++;
		iter();
	}

}

function sameArray(a, b) {

	var flag = true;

	if (a.length != b.length) {
		flag = false;
	} else {
		for (var i = 0; a[i]; a++) {
			if (a[i] != b[i]) {
				flag = false;
				break;
			}
		}
	}

	return flag;

}