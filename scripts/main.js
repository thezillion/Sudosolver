var doc = document, win = window, solved_cells_count = 0;

function _(a) {
	return doc.querySelector(a);
}

function __(a) {
	return doc.querySelectorAll(a);
}

Array.prototype.removeVal = function(v) {
	var i = this.indexOf(v);
	if (i !=- 1)
		this.splice(i, 1); // If -1 is passed, splice removes the last element.
}

function buildSudoku() {
	var styles = "", morestyles = "";
	for (var i = 0; i<9; i++) {
		if ((i + 1) % 3 == 0 && i != 8)
			styles = "border-bottom-width: 3px;border-bottom-color: #B1B1B1;";
		else
			styles = "";
		for (var j = 0; j<9; j++) {

			if ((j + 1) % 3 == 0 && j != 8)
				morestyles = "border-right-width: 3px;border-right-color: #B1B1B1;";
			else
				morestyles = "";

			var a = doc.createElement("span");
			a.setAttribute("class", "cell");
			a.setAttribute("data-coord", i+","+j);
			a.innerHTML = "&nbsp;";
			a.setAttribute("style", styles+morestyles);
			a.addEventListener("click", function() {
				var a = this.getAttribute("data-coord").split(",");
				selectedBox = [parseInt(a[0]), parseInt(a[1])];
				flushAllSelections();
				this.classList.add("sel");
			});
			_("#gridOutline").appendChild(a);
			if (j == 8) _("#gridOutline").appendChild(doc.createElement("br"));
		}
	}
}

function monitorKeyPress(e) {
	var e = win.event || e,
	k = e.keyCode;

	if (k >=96 && k <= 105) {
		k -= 48;
	}

	switch(k) {
		case 13:
			start();
			break;
		case 37:
			move("l");
			break;
		case 38:
			move("u");
			break;
		case 39:
			move("r");
			break;
		case 40:
			move("d");
			break;
		case 46:
		case 8:
			var k = selectedBox[0], l = selectedBox[1];
			// _("*[data-coord='"+k+","+l+"']").innerHTML = "&nbsp;";
			writeToUI(k, l, "&nbsp;");
			e.preventDefault();
			break;
		default:
			var a = String.fromCharCode(k);
			if (a && !isNaN(a)) {
				a = parseInt(a);
				var k = selectedBox[0], l = selectedBox[1];
				// _("*[data-coord='"+k+","+l+"']").innerHTML = a;
				writeToUI(k, l, a);
			}
			break;
	}

}

function move(w) {
	var k = selectedBox[0], l = selectedBox[1];
	switch(w) {
		case "l":
			if (l > 0) l--;
			break;
		case "u":
			if (k > 0) k--;
			break;
		case "r":
			if (l < 8) l++;
			break;
		case "d":
			if (k < 8) k++;
			break;
	}
	selectedBox = [k, l];
	flushAllSelections();
	_("*[data-coord='"+k+","+l+"']").classList.add("sel");
}


function flushAllSelections() {
	var a = __(".sel");
	for (var i = 0; i<a.length; i++)
		a[i].classList.remove("sel");
}

function init() {
	buildSudoku();
	var a = win.grid = [], b = win.poss_grid = [];
	for (var i = 0; i<9; i++) {
		a.push([]);
		b.push([]);
		for (var j = 0; j<9; j++) {
			a[i].push(0);
			b[i].push({updated: false, solved: false, poss: [1, 2, 3, 4, 5, 6, 7, 8, 9]});
		}
	}
	win.total_solved = 0;
	win.selectedBox = [0, 0];
	win.addEventListener("keydown", monitorKeyPress);
	// _("*[data-coord='0,0']").classList.add("sel");

	testCaseMedium();
}

function elem(i, j) {

	return _("*[data-coord='"+i+","+j+"']");

}

function writeToUI(i, j, value) { // writes to corresponding HTML element present in the UI grid

	elem(i, j).innerHTML = value;

}

function loop_cells(func, limit) {

	var ii, jj;

	if (limit) {
		ii = limit.x;
		jj = limit.y;
	} else {
		ii = jj = 9;
	}

	for (var i = 0; i<ii; i++) {
		for (var j = 0; j<jj; j++) {
			func(i, j);
		}
	}

}

function loop_row(r, func) {

	for (var j = 0; j<9; j++) {
		func(r, j);
	}

}

function loop_col(c, func) {

	for (var i = 0; i<9; i++) {
		func(i, c);
	}

}

function loop_3x3(r, c, func) {

	var s = firstCell_3x3(r, c); // Start of the 3x3 corresponding to the current cell
	for (var i = s.row, p = i+2; i<=p; i++) {
		for (var j = s.col, q = j+2; j<=q; j++) {
			func(i, j);
		}
	}

}

function firstCell_3x3(b, a) { // Start of the 3x3 corresponding to the cell

	var cell;

	if (b >= 0 && b <= 2) {
		if (a >= 0 && a <= 2)
			cell = [0, 0];
		else if (a >= 3 && a <= 5)
			cell = [0, 3];
		else if (a >= 6 && a <= 8)
			cell = [0, 6];
	} else if (b >= 3 && b <= 5) {
		if (a >= 0 && a <= 2)
			cell = [3, 0];
		else if (a >= 3 && a <= 5)
			cell = [3, 3];
		else if (a >= 6 && a <= 8)
			cell = [3, 6];
	} else if (b >= 6 && b <= 8) {
		if (a >= 0 && a <= 2)
			cell = [6, 0];
		else if (a >= 3 && a <= 5)
			cell = [6, 3];
		else if (a >= 6 && a <= 8)
			cell = [6, 6];
	}

	return { row: cell[0], col: cell[1] };
	
}

function testCase(test_grid) {

	loop_cells(function(i, j) {
		grid[i][j] = test_grid[i][j];
		writeToUI(i, j, grid[i][j]);
	});
	start();
}

function solved(i, j) {

	return poss_grid[i][j].solved;

}

function testCaseEasy() {
	testCase([
		[0, 6, 2, 0, 0, 0, 0, 0, 3],
		[0, 0, 1, 7, 0, 2, 5, 0, 0],
		[7, 3, 0, 5, 0, 1, 4, 8, 0],
		[6, 0, 0, 4, 8, 7, 0, 0, 0],
		[0, 0, 8, 0, 0, 0, 3, 0, 0],
		[0, 0, 0, 3, 1, 5, 0, 0, 4],
		[0, 1, 5, 2, 0, 6, 0, 3, 9],
		[0, 0, 4, 9, 0, 8, 6, 0, 0],
		[9, 0, 0, 0, 0, 0, 2, 4, 8]
	]);
}

function testCaseMedium() {
	testCase([
		[0, 1, 0, 3, 0, 8, 0, 0, 0],
		[0, 4, 3, 0, 0, 0, 0, 2, 0],
		[5, 8, 0, 0, 9, 0, 0, 0, 0],
		[0, 0, 0, 2, 0, 0, 5, 0, 9],
		[0, 5, 0, 8, 0, 9, 0, 6, 0],
		[3, 0, 4, 0, 0, 5, 0, 0, 0],
		[0, 0, 0, 0, 5, 0, 0, 1, 8],
		[0, 7, 0, 0, 0, 0, 3, 9, 0],
		[0, 0, 0, 7, 0, 2, 0, 5, 0]
	]);
}

function testCaseHard() {
	testCase([
		[4, 0, 0, 3, 2, 0, 0, 0, 0],
		[6, 0, 0, 5, 0, 9, 0, 0, 0],
		[5, 0, 0, 0, 4, 7, 0, 1, 0],
		[3, 0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 7, 0, 0, 0, 8, 0, 0],
		[0, 0, 0, 0, 0, 0, 7, 0, 3],
		[0, 2, 0, 1, 7, 0, 0, 0, 4],
		[0, 0, 0, 4, 0, 5, 0, 0, 2],
		[0, 0, 0, 0, 9, 3, 0, 0, 6]
	]);
}

win.addEventListener("load", init);
_("#testCase").addEventListener("click", testCaseEasy);