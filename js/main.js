'use strict'

const SAFE = ''
const MINE = '💣'
const SMALL_SIZE = 2

var gBoard
var gMineLocation = []

function init() {
	gBoard = buildBoard(4, SMALL_SIZE)
	gMineLocation = creatMines(gBoard, SMALL_SIZE)
	renderBoard(gBoard, '.board-container')
}

function buildBoard(size, mineNumber) {
	const MINE_NUMBER = mineNumber
	var board = []
	for (var i = 0; i < size; i++) {
		board.push([])
		for (var j = 0; j < size; j++) {
			var cell = {
				location: {i, j},
				minesAroundCount: 4,
				isShown: true,
				isMine: false,
				isMarked: true,
				status: SAFE,
			}
			board[i][j] = cell
		}
	}

	return board
}

function creatMines(board, number) {
	var mineLocations = []

	// run until all mines are set
	while (number > mineLocations.length) {
		var i = getRandomInt(0, board.length)
		var j = getRandomInt(0, board.length)

		var mineLocation = {i, j}

		// check if  already contains  mine
		var isOccupied = mineLocations.some((location) => {
			location.i === mineLocation.i && location.j === mineLocation.j
		})
		if (!isOccupied) {
			board[i][j].status = MINE
			board[i][j].isMine = true
			mineLocations.push(mineLocation)
		}
	}
	return mineLocations
}
function revel(elCell) {
	console.log(elCell)
}

function check
