// !function(doc, win) {

var doc = document, win = window;

function start() {

	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {

			var a = parseInt(_("*[data-coord='"+i+","+j+"']").innerHTML);

			a = isNaN(a)?0:a;

			grid[i][j] = a;

			if (a != 0) {
				poss_grid[i][j].p = [a];
				poss_grid[i][j].u = !0;
				poss_grid[i][j].s = !0;
			}
		}
	}
	removePossibilities();
}

function removeVal(arr, v) {
	var i = arr.indexOf(v);
	return i!=-1?arr.splice(i, 1):false; // If -1 is passed, splice removes the last element. This bugged me for so long!
}

function removePossibilities() {

	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {

			var a = grid[i][j];

			if (a != 0) {

				updateRange(i, j);

			}
		}
	}

	appendComputed();
	comparePossibilities();
}

function appendComputed() {
	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {
			var m = poss_grid[i][j];
			if (!m.u && m.s) {
				var a = m.p[0];
				grid[i][j] = a;
				updateRange(i, j);
			}
		}
	}
}

// Now that we have reduced the number of
// possibilities for each cell, only
// these cells are affected by each other,
// not by any other cell. We need to find
// an arrangement where every unfilled cell
// has a different value from the unfilled
// ones in the same row, column or segment.

function comparePossibilities() {
				
	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {
			var a = poss_grid[i][j].p,
			allowed_nos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

			if (!poss_grid[i][j].s) {
			
				for (var k = 0; k<9; k++) {

					// Loop through that row
					var cell_a = poss_grid[i][k];
					if (k != j && !cell_a.s) {
						for (var z = 0; z<cell_a.p.length; z++)
							removeVal(allowed_nos, cell_a.p[z]);
					}

					// Loop through that column
					var cell_b = poss_grid[k][j];
					if (k != i && !cell_b.s) {
						for (var za = 0; za<cell_b.p.length; za++)
							removeVal(allowed_nos, cell_b.p[za]);
					}

				}
				
				// Loop through that segment
				var frodo = segmentStart(i, j);
				for (var m = frodo[0], end = m + 3; m<end; m++) {
					for (var n = frodo[1], en = n + 3; n<en; n++) {
						var cell = poss_grid[m][n];
						if (i != m && j != n) {
							if (!cell.s) {
								for (var zb = 0; zb<cell.p.length; zb++)
									removeVal(allowed_nos, cell.p[zb]);
							}
						}
					}
				}

				for (var zc = 0; zc<a.length; zc++) {
					var vg = a[zc];
					if (allowed_nos.indexOf(vg) != -1) {
						poss_grid[i][j].p = [vg];
						poss_grid[i][j].s = !0;
					}
				}

			}

		}
	}

	appendComputed();
	// logic2();
	recurse_compute();

}

// function not in use
function logic2() {
	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {

			var a = poss_grid[i][j].p,
			req_val = [1, 2, 3, 4, 5, 6, 7, 8, 9];

			// Loop through that segment
			var frodo = segmentStart(i, j);
			for (var m = frodo[0], end = m + 3; m<end; m++) {
				for (var n = frodo[1], en = n + 3; n<en; n++) {
					var cell = poss_grid[m][n];

					if (i != m && j != n) {
						
						if (cell.s) {
							var v = cell.p[0];
							removeVal(req_val, v);
						}

					}
				}
			}

			for (var ka = 0; ka<a.length; ka++) {
				var l = a[ka];
				if (req_val.indexOf(l) == -1) {
					removeVal(a, l);
				}
			}

		}
	}

	recurse_compute();
	appendComputed();

}

function recurse_compute() {

	while (total_solved < 5)
		appendComputed();

	display();
	flushAllSelections();
	win.removeEventListener("keydown", monitorKeyPress);

}

function segmentStart(b, a) {

	if (b >= 0 && b <= 2) {
		if (a >= 0 && a <= 2)
			return [0, 0];
		else if (a >= 3 && a <= 5)
			return [0, 3];
		else if (a >= 6 && a <= 8)
			return [0, 6];
	} else if (b >= 3 && b <= 5) {
		if (a >= 0 && a <= 2)
			return [3, 0];
		else if (a >= 3 && a <= 5)
			return [3, 3];
		else if (a >= 6 && a <= 8)
			return [3, 6];
	} else if (b >= 6 && b <= 8) {
		if (a >= 0 && a <= 2)
			return [6, 0];
		else if (a >= 3 && a <= 5)
			return [6, 3];
		else if (a >= 6 && a <= 8)
			return [6, 6];
	}
	
}

function display() {
	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {

			var elem = _("*[data-coord='"+i+","+j+"']");
			elem.innerHTML = grid[i][j];

			if (!poss_grid[i][j].u) {
				elem.classList.add("u-i");
			}
			
		}
	}
}


function updateRange(i, j) {

	var ii = poss_grid[i][j], ini = ii.p, a;

	// console.log(ii.upd);

	if (ini.length == 1 && !ii.upd) {

		a = ini[0];

		for (var k = 0; k<9; k++) {

			// Loop through that row
			var cell_a = poss_grid[i][k];
			if (k != j && !cell_a.u && !cell_a.s) {
				removeVal(cell_a.p, a);
			}
			if (cell_a.p.length == 1) {
				cell_a.s = !0;
			}

			// Loop through that column
			var cell_b = poss_grid[k][j];
			if (k != i && !cell_b.u && !cell_b.s) {
				removeVal(cell_b.p, a);
			}
			if (cell_b.p.length == 1) {
				cell_b.s = !0;
			}

		}
		
		// Loop through that segment
		var frodo = segmentStart(i, j);
		for (var m = frodo[0], end = m + 3; m<end; m++) {
			for (var n = frodo[1], en = n + 3; n<en; n++) {
				var cell = poss_grid[m][n];
				if (i != m && j != n) {
					if (!cell.u && !cell.s)
						removeVal(cell.p, a);
					if (cell.p.length == 1) {
						cell.s = !0;
					}
				}
			}
		}

		total_solved++;

		ii.upd = true;

	}

}

// start();
// display();

/* var selectedBox = [0, 0]; */

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

function init() {
	buildSudoku();
	var a = win.grid = [], b = win.poss_grid = [];
	for (var i = 0; i<9; i++) {
		a.push([]);
		b.push([]);
		for (var j = 0; j<9; j++) {
			a[i].push(0);
			b[i].push({u: !1, upd: !1, s: !1, p: [1, 2, 3, 4, 5, 6, 7, 8, 9]});
		}
	}
	win.total_solved = 0;
	win.selectedBox = [0, 0];
	win.addEventListener("keydown", monitorKeyPress);
	_("*[data-coord='0,0']").classList.add("sel");
	_("#testCase").addEventListener("click", function() {
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
	});
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
			_("*[data-coord='"+k+","+l+"']").innerHTML = "&nbsp;";
			e.preventDefault();
			break;
		default:
			var a = String.fromCharCode(k);
			if (a && !isNaN(a)) {
				a = parseInt(a);
				var k = selectedBox[0], l = selectedBox[1];
				_("*[data-coord='"+k+","+l+"']").innerHTML = a;
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

function _(a) {
	return doc.querySelector(a);
}

function __(a) {
	return doc.querySelectorAll(a);
}

function testCase(test_grid) {

	for (var i = 0; i<9; i++) {
		for (var j = 0; j<9; j++) {

			grid[i][j] = test_grid[i][j];
			_("*[data-coord='"+i+","+j+"']").innerHTML = grid[i][j];
			
		}
	}
	start();
}

init();

// }(document, window);