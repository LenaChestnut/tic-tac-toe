//GAMEBOARD

const gameBoardModule = (() => {
    const gameBoard = [
        {row: "top", column: "left", d1: "d1"},
        {row: "top", column: "middle",},
        {row: "top", column: "right", d2: "d2",},
        {row: "center", column: "left",},
        {row: "center", column: "middle", d1: "d1", d2: "d2",},
        {row: "center", column: "right",},
        {row: "bottom", column: "left", d2: "d2",},
        {row: "bottom", column: "middle",},
        {row: "bottom", column: "right", d1: "d1",},
    ];

    const gameBoardDisplay = document.querySelector("#gameboard");

    const renderGameBoard = () => { 
        for (let i = 0; i < gameBoard.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add("cell", gameBoard[i].row, gameBoard[i].column);
            if (gameBoard[i].d1) {
                cell.classList.add(gameBoard[i].d1);
                if (gameBoard[i].d2) {
                    cell.classList.add(gameBoard[i].d2);
                }
            } else if (gameBoard[i].d2) {
                cell.classList.add(gameBoard[i].d2);
            }
            cell.setAttribute("id", i);
            gameBoardDisplay.appendChild(cell);
        }
    };

    const clearDisplay = () => {
        while (gameBoardDisplay.firstChild) {
            gameBoardDisplay.removeChild(gameBoardDisplay.firstChild);
        }
    };

    let displayMessage = document.createElement("p");
    displayMessage.classList.add("display-message");

    const renderDisplayMessage = (outcome = null) => {
        gameBoardModule.clearDisplay();
        if (outcome === "win") {
            displayMessage.textContent = `${gameModule.activePlayer.getName()} won!`;
        } else if (outcome === "tie") {
            displayMessage.textContent = `It's a tie!`;
        }
        gameBoardDisplay.appendChild(displayMessage);
    }

    const displayGameResult = (gameResult, row = null) => {
        if (row) {
            row.forEach((cell) => {
                cell.classList.add("win");
            });
        }
        setTimeout(function() {renderDisplayMessage(gameResult)}, 800);
    };

    return {
        gameBoard,
        gameBoardDisplay,
        renderGameBoard,
        clearDisplay,
        displayGameResult,
    }
})();

//PLAYERS

const playersFactory = (name, marker) => {
    const display = document.getElementById(marker);
    display.textContent = name;

    const getName = () => name;
    const getMarker = () => marker;
    const toggleActiveStyle = () => {
        display.classList.toggle("turn");
    }
    const removeActiveStyle = () => {
        display.classList.remove("turn")
    };

    return {
        getName,
        getMarker,
        toggleActiveStyle,
        removeActiveStyle,
    };
};

//GAME

const gameModule = (() => {

    let playerX = playersFactory("Player X", "X");
    let playerO = playersFactory("Player O", "O");

    const chalkSound = document.querySelector("#chalk");
    chalkSound.volume = 0.1;
    const clearSound = document.querySelector("#clear");

    const arrPLayers = [playerX, playerO];

    let activePlayer = null;
    let gameStarted = null;

    const startGame = () => {
        gameStarted = true;
        gameBoardModule.clearDisplay();
        clearSound.play();
        gameBoardModule.renderGameBoard();
        setCellListeners();
        arrPLayers.forEach((player) => player.removeActiveStyle());
        playerO.removeActiveStyle();
        gameModule.activePlayer = playerX;
        gameModule.activePlayer.toggleActiveStyle();
    };

    const setCellListeners = () => {
        const cells = Array.from(document.querySelectorAll(".cell"));
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function(e) {
                // console.log(`${e.target.classList}`);
                if (gameStarted) {
                    if (isEmpty(cells[i])) {
                        markCell(cells[i]);
                        if (hasWon(cells, cells[i])) {
                            gameStarted = false;
                            const winningComb = getWinningComb(cells[i], cells);
                            gameBoardModule.displayGameResult("win", winningComb);
                        } else if (isTie(cells)) {
                            // alert("Tie");
                            gameStarted = false;
                            gameBoardModule.displayGameResult("tie");
                        } else {
                            toggleTurn(cells);
                        }
                    }    
                }
            });
        }
    };

    const toggleTurn = () => {
        if (gameModule.activePlayer === playerX) {
            gameModule.activePlayer = playerO;
        } else if (gameModule.activePlayer === playerO) {
            gameModule.activePlayer = playerX;
        }
        arrPLayers.forEach((player) => player.toggleActiveStyle());
    };

    const isEmpty = (cell) => {
        if (!cell.textContent) {
            return true;
        }
    };

    const markCell = (cell) => {
        cell.textContent = gameModule.activePlayer.getMarker();
        chalkSound.currentTime = 0;
        chalkSound.play();
    };

    const hasWon = (cellsArr, clickedCell) => {
        const d1 = cellsArr.filter(item => item.classList.contains("d1"));
        const d2 = cellsArr.filter(item => item.classList.contains("d2"));

        const currentRow = getCurrentRow(clickedCell, cellsArr);
        const currentColumn = getCurrentColumn(clickedCell, cellsArr);

        if (currentRow.every(hasSameMarker) || currentColumn.every(hasSameMarker) ||
        d1.every(hasSameMarker) || d2.every(hasSameMarker)) {
            return true;
        }
    };

    const hasSameMarker = (currentCell) => {
        const marker = gameModule.activePlayer.getMarker();
        if (currentCell.textContent === marker) {
            return true;
        }
    };

    const getCurrentRow = (clickedCell, cells) => {
        const topRow = cells.filter(item => item.classList.contains("top"));
        const centerRow = cells.filter(item => item.classList.contains("center"));
        const bottomRow = cells.filter(item => item.classList.contains("bottom"));

        let row;
        if (clickedCell.classList.contains("top")) {
            row = topRow;
        } else if (clickedCell.classList.contains("center")) {
            row = centerRow;
        } else if (clickedCell.classList.contains("bottom")) {
            row = bottomRow;
        }
        return row;
    };

    const getCurrentColumn = (clickedCell, cells) => {
        const leftColumn = cells.filter(item => item.classList.contains("left"));
        const middleColumn = cells.filter(item => item.classList.contains("middle"));
        const rightColumn = cells.filter(item => item.classList.contains("right"));

        let column;
        if (clickedCell.classList.contains("left")) {
            column = leftColumn;
        } else if (clickedCell.classList.contains("middle")) {
            column = middleColumn;
        } else if (clickedCell.classList.contains("right")) {
            column = rightColumn;
        }
        return column;
    };

    const getWinningComb = (clickedCell, cells) => {
        const currentRow = getCurrentRow(clickedCell, cells);
        const currentColumn = getCurrentColumn(clickedCell, cells);
        
        const d1 = cells.filter(item => item.classList.contains("d1"));
        const d2 = cells.filter(item => item.classList.contains("d2"));

        if (currentRow.every(hasSameMarker)) {
            winningComb = currentRow;
        } else if (currentColumn.every(hasSameMarker)) {
            winningComb = currentColumn;
        } else if (d1.every(hasSameMarker)) {
            winningComb = d1;
        } else if (d2.every(hasSameMarker)) {
            winningComb = d2;
        }
        return winningComb;
    };

    const isTie = (cells) => {
        let result = cells.every(function(item) {
            if (item.textContent !== "") {
                return true;
            }    
        });

        if (result) {
            return true;
        }
    };

    const startButton = document.querySelector("#play");
    startButton.addEventListener("click", function() {
        if (!gameStarted) {
            startGame();
        }
    });

    const refreshButton = document.querySelector("#restart");
    refreshButton.addEventListener("click", function() {
        startGame();
    });

    return {
        playerX,
        playerO,
        activePlayer,
        startGame,
    };
})();

// On-load for testing
// gameModule.startGame();