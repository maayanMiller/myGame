'use strict'

var gMineNum
var gMinute
var gSecond
var gMillisecond

function renderBoard(mat, selector) {
	var strHTML = `<table border="0"><tbody>`
	for (var i = 0; i < mat.length; i++) {
		strHTML += `<tr>`
		for (var j = 0; j < mat[0].length; j++) {
			var cell = mat[i][j]
			strHTML += `<td class="cell cell-${i}-${j}" oncontextmenu="mark(event,this)"onclick="revel(this)"data-i="${i}" data-j="${j}" data-> ${cell.status} </td>`
		}
		strHTML += `</tr>`
	}
	strHTML += `</tbody></table>`
	var elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}
function getEmptyCell() {
	var emptyCells = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			var cell = gBoard[i][j]
			var location = {i, j}
			if (!cell.isMine && !cell.isMark && !cell.isShown && !cell.isLocked)
				emptyCells.push(location)
		}
	}
	var rnxIdx = emptyCells[getRandomInt(0, emptyCells.length)]
	return rnxIdx
}
function setTimer() {
	if ((gMillisecond += 1) == 100) {
		gMillisecond = 0
		gSecond++
	}
	if (gSecond == 60) {
		gSecond = 0
		gMinute++
	}
	if (gMinute == 60) {
		gMinute = 0
		gHour++
	}

	var msg = ` ${gMinute}:${gSecond}:${gMillisecond}`
	gTimeBoard.textContent = msg
}
function DisplayInfo() {
	var markBoard = document.querySelector('.mark__remain')
	markBoard.textContent = gMarkCount
	var time = document.querySelector('.time')
	time.textContent = '00:00:00'
}
