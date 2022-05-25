'use strict'

function renderBoard(mat, selector) {
	var strHTML = `<table border="0"><tbody>`
	for (var i = 0; i < mat.length; i++) {
		strHTML += `<tr>`
		for (var j = 0; j < mat[0].length; j++) {
			var cell = mat[i][j]
			strHTML += `<td class="cell cell-${i}-${j}" onclick="revel(this)" contextmenu="mark(this)"> ${cell.status} </td>`
		}
		strHTML += `</tr>`
	}
	strHTML += `</tbody></table>`
	var elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
	var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

	elCell.innerHTML = value
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}
