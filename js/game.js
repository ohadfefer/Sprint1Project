'use strict'

const MINE = '💣'
const FLAG = '🚩'

const isGameOver = false

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
    document.querySelector('.bombs-left').innerHTML = `${gLevel.MINES - gGame.markedCount}`
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
    //setMinesAtRand(board)
    setMinesNegsCount(board) // update each cell with number of neighbors mines
    
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
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function setMinesNegsCount(board) { // will shorten the code after 
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
    const cell = gBoard[i][j]
    if (cell.isMarked || cell.isRevealed) return
    cell.isRevealed = true
    if (!cell.isMine) gGame.revealedCount++
    elCell.classList.add('cell-clicked')

    const cellContent = cell.isRevealed ? (cell.isMine ? '💣' : cell.minesAroundCount) : ''
    elCell.innerHTML = (cell.minesAroundCount === 0) ? (cell.isMine ? '💣' : '') : cellContent

    if (!cell.isMine && cell.minesAroundCount === 0) {
        expandReveal(gBoard, i, j) 
    }
    
    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked
    elCell.innerHTML = cell.isMarked ? FLAG : ''
    if (cell.isMarked){
        gGame.markedCount++
        if (cell.isMine) gGame.revealedCount++
    } 
    if (!cell.isMarked) {
        gGame.markedCount--
        if (cell.isMine) gGame.revealedCount--
    }

    checkGameOver()
    document.querySelector('.bombs-left').innerHTML = `${gLevel.MINES - gGame.markedCount}`
}


function setMinesAtRand(board) {
    var minesSet = 0
    var max = gLevel.SIZE
    var minesLeft = gLevel.MINES
    while(minesSet < minesLeft) {
        var i = getRandomInt(0, max)
        var j = getRandomInt(0, max)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesSet++ 
        }  
    }
}

function checkGameOver() {
    if (gGame.revealedCount === gLevel.SIZE**2) console.log('victory')
}

function expandReveal(board, elCell, i, j) { // will shorten the code after
    if (elCell.minesAroundCount === 0) {
        for(var m = i - 1; m < i + 2; m++) {
            if (m < 0 || m >= board.length) continue
            for(var n = j - 1; n < j + 2; n++) {
                if (n < 0 || n >= board.length) continue
                if (m === i && n === j) continue

                const negCell = board[m][n]
                if (negCell.isRevealed || negCell.isMarked) continue
                negCell.isRevealed = true
                gGame.revealedCount++

                const elNegCell = document.querySelector(`.cell-${m}-${n}`)
                elNegCell.classList.add('cell-clicked')
                elNegCell.innerHTML = negCell.isMine ? '💣' : negCell.minesAroundCount
                
            }
        }
    }
    
}


function resetGame() {
    onInit()
}