function start() {

	win.scc = 0;

	loop_cells(function(i, j) {

		var a = parseInt(_("*[data-coord='"+i+","+j+"']").innerHTML);

		a = isNaN(a)?0:a;

		grid[i][j] = a;

		if (a != 0) {
			poss_grid[i][j].poss = [a];
			elem(i, j).classList.add("cell-b");
			win.scc++;
		}

	});

	think();

}

function think() {

	adjustPossibilities();
	considerUniquePoss();
	resolveLeftovers();
	updateLeftovers();

}

function adjustPossibilities(cell) {

	if (cell) {

		updatePossibilities(cell.row, cell.col);

	} else {

		win.grid_edited = false;

		loop_cells(function(i, j) {

			if (!solved(i, j) && poss_grid[i][j].poss.length == 1) {
				updatePossibilities(i, j);

				if (grid_edited == false)
					win.grid_edited = true;
			}

		});

		if (win.grid_edited == true)
			adjustPossibilities();
		else {
			console.log("Adjusting Possibilities: ", solved_cells_count-win.scc);
			win.scc = solved_cells_count; // boring. Don't care about these globals. They only help keep count.
		}

	}

}

function updatePossibilities(i, j) { // remove possible candidate from current row, col and 3x3

	registerIfSolved(i, j);

	var number = poss_grid[i][j].poss[0]; // number to be removed from current row, col and 3x3

	function editCell(row, col) { // Common function to be executed across rows, cols and 3x3s

		if (!solved(row, col)) {
			poss_grid[row][col].poss.removeVal(number);
		}

	}

	loop_row(i, function(row, col) { // Edit each cell in current row
		editCell(row, col, number);
	});
	loop_col(j, function(row, col) { // Edit each cell in current col
		editCell(row, col, number);
	});
	loop_3x3(i, j, function(row, col) { // Edit each cell in current 3x3
		editCell(row, col, number);
	});

}

function considerUniquePoss() {
	
	// We are down to leftover possibilities.
	// What if there are candidates for a cell, which are not candidates for any cell in the
	// same row, col and 3x3? Then that means that that candidate is the right choice for that
	// particular cell.

	var initial_solved_cells_count = solved_cells_count;

	if (solved_cells_count < 81) { // The grid should not be completely solved, for this to work

		loop_cells(function(row, col) {

			var cell = poss_grid[row][col];
			
			if (!solved(row, col)) {

				var poss = cell.poss, search_value;

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

					if (search_value != -1) // searching for the next possibility if this one is a candidate in any cell in the current row
						continue;

					for (var q = 0; q<9; q++) {

						if (!solved(q, col) && q != row) {

							search_value = poss_grid[q][col].poss.indexOf(value);

							if (search_value != -1) {
								break;
							}

						}

					}

					if (search_value != -1) // searching for the next possibility if this one is a candidate in any cell in the current col
						continue;

					var fcell = firstCell_3x3(row, col); // Start of the 3x3 corresponding to the current cell
					for (var r = fcell.row, rr = r+2; r<=rr; r++) {

						for (var s = fcell.col, ss = s+2; s<=ss; s++) {

							if (!solved(r, s) && r != row && s != col) {

								search_value = poss_grid[r][s].poss.indexOf(value);

								if (search_value != -1) {
									break;
								}

							}

						}

						if (search_value != -1) // breaking out if value is found
							break;

					}

					if (search_value != -1) { // searching for the next possibility if this one is a candidate in any cell in the current 3x3
						continue;
					} else {
						poss_grid[row][col].poss = [value];
						registerIfSolved(row, col);
						elem(row, col).classList.add("u-i"); // dark blue background for solved cells
						break;
					}

				}

			}

		});

	}

	console.log("Considering unique possibilities: ", (solved_cells_count - initial_solved_cells_count));

}

function registerIfSolved(i, j) { // If there is only one possible candidate for a particular cell, it needs to be marked as solved

	var cell = poss_grid[i][j];
	if (!solved(i, j) && cell.poss.length == 1){
		cell.solved = true;
		writeToUI(i, j, cell.poss[0]);
		elem(i, j).classList.add("u-i"); // dark blue background for solved cells
		solved_cells_count++;
	}

}

function updateLeftovers() { // To list the leftover possibiilities of unsolved cells

	loop_cells(function(row, col) {

		var temp = poss_grid[row][col];
		if (temp.solved == false) {
			var possibilities = temp.poss[0];
			for (var i = 1; i<temp.poss.length; i++)
				possibilities += "/" + temp.poss[i];
			writeToUI(row, col, possibilities);
		}

	});

}

function resolveLeftovers() {

	// For the unsolved cells, all the candidate possibilities are valid.
	// We choose the first possibility for the first unsolved cell.
	// Then we update the corresp. possibilities for that row, col and 3x3, which narrows down our set.
	// We repeat this until our sudoku is solved

	while (solved_cells_count < 81) {

		for (var i = 0; i<9; i++) {

			for (var j = 0; j<9; j++) {

				if (!solved(i, j)) {

					var cell = poss_grid[i][j], index = Math.floor(Math.random()*cell.poss.length);

					console.log("Length: ", cell.poss.length);

					cell.poss = [cell.poss[index]]; // artificially solve this cell

					console.log("Resolved cell at "+i+", "+j+". Index: "+index);

					adjustPossibilities(); // {row: i, col: j}
					considerUniquePoss();
					break;
				}

			}

			if (j < 9)
				break;

		}

	}

}

function resolveOneLeftover(i, j, index) {

	if (!index) index = 0;

	var value = poss_grid[i][j].poss[index];
	poss_grid[i][j].poss = [value];
	writeToUI(i, j, value);

	console.log("Resolved cell at "+i+","+j);

	adjustPossibilities();
	considerUniquePoss();
	updateLeftovers();

}