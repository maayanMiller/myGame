'use strict'

const ICON = '😃'
const SAFE = ''
const MINE = '💣'
const MARKED = '🚩'
const LIFE_ICON = '❤️'
const HURT = '🤕'
const WINNER = '😎'
const LOSER = '💀'
const HINT_ICON = '🖐️'
const SAFE_MOVE = '🔥'

const LEVEL_ONE = 4
const LEVEL_TWO = 8
const LEVEL_THREE = 12

var gLife
var gMarkCount = 2

var gLevel
var gMine = 2
var gHintCount
var gSafeCount

var gIsFirstClick
var gIsWin
var gIsGameOn = true

var gMineCheck = 0
var gTimer
var gBoard
var gHistoryBoard

var gLifeIcon = document.querySelector('.life')
var gIcon = document.querySelector('.icon')
var gTimeBoard = document.querySelector('.time')
var gSafeIcon = document.querySelector('.safe')

function init() {
	gSafeIcon.textContent = SAFE_MOVE
	gIcon.textContent = ICON
	gLifeIcon.innerHTML = `${LIFE_ICON}<span class="life_score">3</span>`

	gHistoryBoard = []
	gIsFirstClick = true
	gIsGameOn = true
	gIsWin = false

	gMinute = 0
	gSecond = 0
	gMillisecond = 0

	gLife = 3
	gHintCount = 3
	gSafeCount = 1

	gBoard = buildBoard(gLevel)
	console.log('gBoard:', gBoard)
	renderBoard(gBoard, '.board-container')
}

function buildBoard(size = LEVEL_ONE) {
	var board = []
	for (var i = 0; i < size; i++) {
		board.push([])
		for (var j = 0; j < size; j++) {
			var cell = {
				location: {i, j},
				isShown: false,
				isMine: false,
				isHurt: false,
				isLocked: false,
				isMarked: false,
				status: SAFE,
			}
			board[i][j] = cell
		}
	}

	return board
}
function creatMines(number = 2) {
	var rnxIdx
	for (var i = 0; i < number; i++) {
		rnxIdx = getEmptyCell(gBoard)
		gBoard[rnxIdx.i][rnxIdx.j].isMine = true
	}
}

function revel(elCell) {
	var i = +elCell.dataset.i
	var j = +elCell.dataset.j
	var cell = gBoard[i][j]
	if (gIsFirstClick) {
		cell.status = 0
		var neighbors = setNegsCount(cell, gBoard)
		for (var j = 0; j < neighbors.length; j++) {
			neighbors[j].isLocked = true
		}
		creatMines(gMine)
		upDateGBoard()
		DisplayInfo()
		// revelNeighborOne(cell, gBoard)
		gTimer = setInterval(setTimer, 10)
		gIsFirstClick = false
		elCell.classList.add('shown')
		cell.isShown = true
		revelNeighbor(cell, gBoard)
	}

	if (cell.isShown || cell.isMarked || !gIsGameOn) return

	var historyCell = {
		i: i,
		j: j,
	}
	gHistoryBoard.push(historyCell)
	if (cell.status === 0) {
		revelNeighbor(cell, gBoard)
		elCell.innerText = ''
	} else {
		elCell.innerText = cell.status
	}

	if (cell.isMine === true) {
		if (gLife > 0) {
			--gLife
			gIcon.textContent = HURT
			elCell.textContent = '☠️'
			elCell.classList.add('shown')
			cell.isShown = true
			cell.isHurt = true
			gMine--
			if (gMine === 0) endGame(gBoard)
			if (gLife === 0) {
				gLifeIcon.innerHTML = `${LIFE_ICON}<span class="life_score"></span>`
			} else {
				gLifeIcon.innerHTML = `${LIFE_ICON}<span class="life_score">${gLife}</span>`
			}
			return
		}
		endGame(elCell, cell)
	} else {
		elCell.classList.add('shown')
		cell.isShown = true
	}
}
function mark(e, elCell) {
	e.preventDefault()
	if (gIsFirstClick) {
		creatMines(gMine)
		upDateGBoard()
		gTimer = setInterval(setTimer, 10)
		gIsFirstClick = false
	}

	var i = +elCell.dataset.i
	var j = +elCell.dataset.j
	var cell = gBoard[i][j]

	if (!gIsGameOn) return
	if (cell.isShown) return

	if (cell.isMarked) {
		cell.isMarked = false
		cell.status = SAFE
		elCell.textContent = SAFE
		++gMarkCount
		DisplayInfo()
		return
	} else {
		if (gMarkCount === 0) return
		--gMarkCount
		cell.isMarked = true
		cell.status = MARKED
		elCell.textContent = MARKED
		checkWin()
		if (gIsWin) endGame(elCell, cell)
	}
	DisplayInfo()
}

function setMinesNegsCount(cell, mat, elCell) {
	var neighbors = []

	for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
			if (i === cell.location.i && j === cell.location.j) continue
			if (j < 0 || j >= mat[i].length) continue
			if (mat[i][j].isMine) neighbors.push(mat[i][j])
		}
	}

	return neighbors
}

function checkWin() {
	var count = 0
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			if (gBoard[i][j].isMarked && gBoard[i][j].isMine) count++
		}
	}
	if (count === gMine) gIsWin = true
}
function endGame(cell) {
	clearInterval(gTimer)
	if (gIsWin) {
		gIcon.textContent = WINNER
		gLifeIcon.textContent = WINNER
	}
	if (!gIsWin) {
		gIcon.textContent = LOSER
		gLifeIcon.textContent = LOSER

		cell.status = MINE
		cell.isShown = true
		displayMines()
	}
	gIsGameOn = false
}

function level1(button) {
	clearInterval(gTimer)
	gLevel = LEVEL_ONE
	gMarkCount = 2
	gMine = 2
	init()
}
function level2(button) {
	clearInterval(gTimer)
	gLevel = LEVEL_TWO
	gMarkCount = 12
	gMine = 12
	init()
}
function level3(button) {
	clearInterval(gTimer)
	gLevel = LEVEL_THREE
	gMine = 30
	gMarkCount = 30
	init()
}

function getHint() {
	if (gHintCount === 0 || !gIsGameOn) return
	var emptyCell = getEmptyCell()
	var i = emptyCell.i
	var j = emptyCell.j
	var emptyElCell = document.querySelector(`.cell-${i}-${j}`)
	emptyElCell.textContent = HINT_ICON
	setTimeout(() => {
		emptyElCell.textContent = ''
	}, 300)
	gHintCount--
}

function undo() {
	if (gHistoryBoard.length === 0 || !gIsGameOn) return
	var lastCellLocation = gHistoryBoard.pop()

	var i = lastCellLocation.i
	var j = lastCellLocation.j
	var elCell = document.querySelector(`.cell-${i}-${j}`)
	var cell = gBoard[i][j]
	cell.isShown = false

	elCell.classList.remove('shown')
	elCell.textContent = SAFE

	if (cell.isHurt) {
		if (gLife === 3) return
		++gLife
		var life = document.querySelector('.life_score')
		life.textContent = gLife
		if (gLife === 3) gIcon.textContent = ICON
	}

	if (cell.isMine) gMine++
}

function revelNeighbor(cell, mat) {
	var neighbors = []
	var mines = []
	if (cell.isMine || cell.isMarked) return
	var counter = 0
	for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
			if (i === cell.location.i && j === cell.location.j) continue
			if (j < 0 || j >= mat[i].length) continue
			if (mat[i][j].isShown) continue
			if (!mat[i][j].isMine) neighbors.push(mat[i][j])
			if (mat[i][j].isMine) {
				counter++
				mines.push(mat[i][j])
			}
		}
	}

	for (var x = 0; x < neighbors.length; x++) {
		var locationI = neighbors[x].location.i
		var locationJ = neighbors[x].location.j
		var nextCell = gBoard[locationI][locationJ]
		// if (nextCell.isMarked) continue

		var nextElCell = document.querySelector(`.cell-${locationI}-${locationJ}`)

		if (nextCell.status === 0 && !nextCell.isShown) {
			// revelNeighborOne(nextCell, gBoard)

			nextElCell.textContent = ''
			nextElCell.classList.add('shown')
			nextCell.isShown = true
			revelNeighbor(nextCell, gBoard)
			revelNeighborOne(nextCell, gBoard)
		}
	}
}

function getSafe() {
	if (gSafeCount === 0 || !gIsGameOn || gIsFirstClick) return
	var cellLocation = getEmptyCell()
	var cell = gBoard[cellLocation.i][cellLocation.j]
	while (cell.status !== 0) {
		var cellLocation = getEmptyCell()
		var cell = gBoard[cellLocation.i][cellLocation.j]
	}
	cell.isShown = true
	console.log('cell:', cell)

	var elCell = document.querySelector(`.cell-${cellLocation.i}-${cellLocation.j}`)
	elCell.classList.add('shown')
	elCell.innerText = SAFE_MOVE

	revelNeighbor(cell, gBoard)

	gSafeIcon.textContent = ''

	gSafeCount--
}
function upDateGBoard() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			var neighbors = setMinesNegsCount(gBoard[i][j], gBoard)
			gBoard[i][j].status = neighbors.length
		}
	}
}

function displayMines() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			if (gBoard[i][j].isMine) {
				var cell = gBoard[i][j]
				cell.isShown = true
				var elCell = document.querySelector(`.cell-${i}-${j}`)
				elCell.textContent = MINE
				elCell.classList.add('boom')
			}
		}
	}
}
function setNegsCount(cell, mat, elCell) {
	var neighbors = []

	for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
			if (i === cell.location.i && j === cell.location.j) continue
			if (j < 0 || j >= mat[i].length) continue
			neighbors.push(mat[i][j])
		}
	}

	return neighbors
}
function revelNeighborOne(cell, mat) {
	var neighbors = []
	var mines = []
	if (cell.isMine || cell.isMarked) return
	var counter = 0
	for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
			if (i === cell.location.i && j === cell.location.j) continue

			if (j < 0 || j >= mat[i].length) continue
			if (!mat[i][j].isMine) neighbors.push(mat[i][j])
		}
	}

	for (var x = 0; x < neighbors.length; x++) {
		var locationI = neighbors[x].location.i
		var locationJ = neighbors[x].location.j
		var nextCell = gBoard[locationI][locationJ]

		var nextElCell = document.querySelector(`.cell-${locationI}-${locationJ}`)
		nextCell.isShown = true
		nextElCell.classList.add('shown')

		if (nextCell.status === 0) {
			nextElCell.textContent = SAFE
		} else {
			nextElCell.innerText = nextCell.status
		}
	}
}
