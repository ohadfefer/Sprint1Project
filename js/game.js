'use strict'

const MINE = '💣'
const FLAG = '🚩'

var isFirstClick = true
var gBoard
var gGame

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        lives: 3,
        secsPassed: 0,
        timerId: null,
        hints: 3,
        isHintActive: false,
        isHintRevealing: false
    }
    
    gBoard = buildBoard()
    renderBoard(gBoard, '.game-container')
    document.querySelector('.bombs-left').innerHTML = `${gLevel.MINES - gGame.markedCount}`
    const lives = document.querySelectorAll('.life')
    lives.forEach(life => {
        life.classList.remove('life-used')
    })
    document.querySelector('.timer').innerHTML = '000'
    document.querySelector('.smiley-reset').innerHTML = '😀'
    updateHintsDisplay()
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
            const cellContent = cell.isRevealed ? (cell.isMine ? MINE : cell.minesAroundCount) : ''
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;">${cellContent}</td>`
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
    if (!gGame.isOn || gGame.isHintRevealing) return

    const cell = gBoard[i][j]
    if (cell.isMarked || cell.isRevealed) return

    if (gGame.isHintActive) {
        gGame.isHintActive = false
        gGame.hints--
        revealHint(gBoard, i, j)
        updateHintsDisplay()
        return
    }

    if (isFirstClick) {
        isFirstClick = false
        setMinesAtRand(gBoard, i, j)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard, '.game-container') 
        time()
        expandReveal(gBoard, i, j)
        return
    } else if (cell.isMine) {
        gGame.lives--
        const lives = document.querySelectorAll('.life')
        if (gGame.lives >= 0 && gGame.lives < lives.length) {
            lives[gGame.lives].classList.add('life-used')
        }
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
       expandReveal(gBoard, i, j)
    }

    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn || isFirstClick || gGame.isHintRevealing) return

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

function expandReveal(board, i, j) {
    const cell = board[i][j]
    if (cell.isRevealed || cell.isMarked || cell.isMine) return

    cell.isRevealed = true
    gGame.revealedCount++
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.classList.add('cell-clicked')
    elCell.innerHTML = cell.minesAroundCount === 0 ? '' : cell.minesAroundCount

    if (cell.minesAroundCount > 0) return

    for (var m = -1; m <= 1; m++) {
        for (var n = -1; n <= 1; n++) {
            const im = i + m
            const jn = j + n
            if (im < 0 || jn < 0 || im >= board.length || jn >= board[0].length) continue
            if (im === i && jn === j) continue
            expandReveal(board, im, jn)
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
    const lives = document.querySelectorAll('.life')
    lives.forEach(life => {
        life.classList.remove('life-used')
    })
}

function time() {
    gGame.secsPassed = 0
    document.querySelector('.timer').innerHTML = '000'
    gGame.timerId = setInterval(() => {
        gGame.secsPassed++
        document.querySelector('.timer').innerHTML = gGame.secsPassed.toString().padStart(3, '0')
    }, 1000)
}

function onHintClicked(hintId) {
    if (!gGame.isOn || gGame.hints === 0 || gGame.isHintActive || isFirstClick) return
    gGame.isHintActive = true
    const elHint = document.querySelector(`.hint:nth-child(${hintId})`)
    elHint.classList.add('hint-active')
}

function revealHint(board, i, j) {
    gGame.isHintRevealing = true
    const cellsToReveal = []
    const cell = board[i][j]
    if (!cell.isRevealed && !cell.isMarked) {
        cellsToReveal.push({ i, j, wasRevealed: cell.isRevealed })
        cell.isRevealed = true
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.classList.add('cell-clicked')
        elCell.innerHTML = cell.isMine ? MINE : (cell.minesAroundCount === 0 ? '' : cell.minesAroundCount)
    }
    const originalRevealedCount = gGame.revealedCount
    
    const tempExpandReveal = (board, i, j) => {
        for (var m = i - 1; m < i + 2; m++) {
            if (m < 0 || m >= board.length) continue
            for (var n = j - 1; n < j + 2; n++) {
                if (n < 0 || n >= board[0].length) continue
                if (m === i && n === j) continue
                const negCell = board[m][n]
                if (negCell.isRevealed || negCell.isMarked) continue
                cellsToReveal.push({ i: m, j: n, wasRevealed: negCell.isRevealed })
                negCell.isRevealed = true
                const elNegCell = document.querySelector(`.cell-${m}-${n}`)
                elNegCell.classList.add('cell-clicked')
                elNegCell.innerHTML = negCell.isMine ? MINE : (negCell.minesAroundCount === 0 ? '' : negCell.minesAroundCount)
            }
        }
    }
    tempExpandReveal(board, i, j)
    
    
    gGame.revealedCount = originalRevealedCount
    setTimeout(() => {
        for (var k = 0; k < cellsToReveal.length; k++) {
            const { i, j, wasRevealed } = cellsToReveal[k]
            const cell = board[i][j]
            if (!wasRevealed) {
                cell.isRevealed = false
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.remove('cell-clicked')
                elCell.innerHTML = cell.isMarked ? FLAG : ''
            }
        }
        const activeHint = document.querySelector('.hint-active')
        if (activeHint) activeHint.classList.replace('hint-active', 'hint-used')
        gGame.isHintRevealing = false
    }, 1500)
}

function updateHintsDisplay() {
    const hints = document.querySelectorAll('.hint')
    for (var i = 0; i < hints.length; i++) { 
        if (i < gGame.hints) {
            hints[i].classList.remove('hint-used')
        } else {
            hints[i].classList.add('hint-used')
        }
        hints[i].classList.remove('hint-active')
    }
}