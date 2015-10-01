function doublePairs() {

	if (solved_cells_count < 81) {

		var e = enumerate_3x3s(); // borrowing this function from the candidateLInes algorithm
		var dP = identifyDoublePairs(e);

		console.log(dP);

	}

}

function identifyDoublePairs(e) {

	// for cols

	var dP = {
		0: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		1: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		2: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		3: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		4: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		5: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		6: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		7: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},
		8: { 
			1: { hasDP: false, cols: []},
			2: { hasDP: false, cols: []},
			3: { hasDP: false, cols: []},
			4: { hasDP: false, cols: []},
			5: { hasDP: false, cols: []},
			6: { hasDP: false, cols: []},
			7: { hasDP: false, cols: []},
			8: { hasDP: false, cols: []},
			9: { hasDP: false, cols: []},
		},

	};

	for (var i = 0; i<=8; i++) {

		for (var j = 1; j<=9; j++) {

			var inst = e[i][j], instlen = inst.length;

			if (instlen > 1) {

				var no_cols = 0, cols_vis = [];
				for (var k = 0; k<instlen; k++) {
					var instance = inst[k][1];
					if (!in_array(cols_vis, instance)) {
						cols_vis.push(instance);
						no_cols++;
					}
				}

				if (no_cols == 2) {
					dP[i][j].hasDP = true;
					cols_vis.duplicateTo(dP[i][j].cols);
				}

			}

		}

	}

	return dP;

}

function verifyDoublePairs(dP) {

	// this function checks if double pairs are present in two 3x3s in the same line

	for (var i = 0; i<=2; i++) {

		for (var j = 1; j<=9; j++) {

			if (sameArray(dP[i][j].cols, dP[i+3][j].cols)) {

				// to be coded
				console.log();

			}

		}

	}

}