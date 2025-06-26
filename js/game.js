'use strict'

const MINE = '💣'
const FLAG = '🚩'

var isFirstClick = true
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard
var gGame

function onInit() {
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        lives: 3,
        secsPassed: 0,
        timerId: null
    }
    
    gBoard = buildBoard()
    renderBoard(gBoard, '.game-container')
    document.querySelector('.bombs-left').innerHTML = `${gLevel.MINES - gGame.markedCount}`
    document.querySelector('.lives').innerHTML = `Lives: ${gGame.lives}`
    document.querySelector('.timer').innerHTML = '000'
    document.querySelector('.smiley-reset').innerHTML = '😀'
}


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
    if (!gGame.isOn) return 

    const cell = gBoard[i][j]
    if (cell.isMarked || cell.isRevealed) return

    if (isFirstClick) {
        console.log('first click')
        isFirstClick = false
        cell.isRevealed = true
        if (!cell.isMine) gGame.revealedCount++
        setMinesAtRand(gBoard, i, j)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard, '.game-container')

        const renderElCell = document.querySelector(`.cell-${i}-${j}`)
        renderElCell.classList.add('cell-clicked')
        renderElCell.innerHTML = cell.minesAroundCount === 0 ? '' : cell.minesAroundCount
        time()
    } else if (cell.isMine) {
        gGame.lives-- 
        document.querySelector('.lives').innerHTML = `Lives: ${gGame.lives}`
        if (gGame.lives > 0) {
            gGame.isOn = false
            elCell.classList.add('mine-clicked')
            elCell.innerHTML = MINE
            setTimeout(() => {
                gGame.isOn = true
                elCell.classList.remove('mine-clicked')
                cell.isRevealed = false
                elCell.innerHTML = cell.isMarked ? FLAG : ''
            }, 2000)
        }
    } else {
        cell.isRevealed = true
        if (!cell.isMine) gGame.revealedCount++
        elCell.classList.add('cell-clicked')
        const cellContent = cell.isMine ? '💣' : cell.minesAroundCount
        elCell.innerHTML = (cell.minesAroundCount === 0) ? (cell.isMine ? '💣' : '') : cellContent
    }

    if (!cell.isMine && cell.minesAroundCount === 0) {
        expandReveal(gBoard, i, j) 
    }
    
    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn) return 
    if (isFirstClick) return
    
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


function setMinesAtRand(board, firstClickI, firstClickJ) {
    var minesSet = 0
    var max = gLevel.SIZE
    var minesLeft = gLevel.MINES
    while(minesSet < minesLeft) {
        var i = getRandomInt(0, max)
        var j = getRandomInt(0, max)
        if (i === firstClickI && j === firstClickJ) continue
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesSet++ 
        }  
    }
}


function expandReveal(board, i, j) { // will shorten the code after

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
            elNegCell.innerHTML = (negCell.minesAroundCount === 0) ? '' : negCell.minesAroundCount        
        }
    }
}


function revealMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isRevealed = true
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('cell-clicked')
                elCell.innerHTML = MINE
            }
        }
    }
}


function setDifficulty1() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    resetGame()
}


function setDifficulty2() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    resetGame()
}

function setDifficulty3() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    resetGame()
}

function checkGameOver() {
    if (gGame.lives === 0) {
        revealMines(gBoard)
        gGame.isOn = false
        clearInterval(gGame.timerId)
        document.querySelector('.smiley-reset').innerHTML = '🤯'
    } else if (gGame.revealedCount === gLevel.SIZE**2) {
        gGame.isOn = false
        document.querySelector('.smiley-reset').innerHTML = '😎'
        clearInterval(gGame.timerId)
    }
}

function resetGame() {
    isFirstClick = true
    if (gGame && gGame.timerId) clearInterval(gGame.timerId)
    onInit()
}

function time() {
    gGame.secsPassed = 0
    document.querySelector('.timer').innerHTML = '000'
    gGame.timerId = setInterval(() => {
        gGame.secsPassed++
        document.querySelector('.timer').innerHTML = gGame.secsPassed.toString().padStart(3, '0')
    }, 1000)
}