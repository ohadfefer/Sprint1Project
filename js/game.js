'use strict'

const MINE = '💣'
const FLAG = '🚩'



var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard
var gGame

function onInit() {
    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        //secsPassed
    }

    gBoard = buildBoard()
    renderBoard(gBoard, '.game-container')
}

// A Matrix containing cell objects:

function buildBoard() { 
    const size = gLevel.SIZE
    const board = []

    for(var i = 0; i < size; i++) {
        board.push([])

        for(var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
            
        }
    }
    
    board[1][1].isMine = true
    board[2][2].isMine = true
    setMinesNegsCount(board) // update each cell with number of neighbors mines

    console.log(board)
    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            const cellContent = cell.isRevealed ? (cell.isMine ? '💣' : cell.minesAroundCount) : ''
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function setMinesNegsCount(board) {
    var size = gLevel.SIZE
    for(var i = 0; i < size; i++) {
        for(var j = 0; j < size; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) continue
            for(var m = i-1; m < i+2; m++) {
                if (m < 0 || m >= size) continue
                for(var n = j-1; n < j+2; n++) {
                    if (n < 0 || n >= size) continue
                    else {
                        var negCell = board[m][n]
                        if (negCell.isMine) currCell.minesAroundCount++    
                    }

                }
            }
        }
    }
}


function onCellClicked(elCell, i, j) {
    
}