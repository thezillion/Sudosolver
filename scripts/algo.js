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
	nakedPairs();
	candidateLines();
	// choosePossibilities();
	// resolveLeftovers();
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

function removePossibility(i, j, value) {

	if (!solved(i, j)) {

		var index = poss_grid[i][j].poss.indexOf(value);
		// console.log(index);

		if (index != -1)
			poss_grid[i][j].poss.splice(index, 1);

	}

}