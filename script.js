const gameboardController = (() => {
    const gameboard = [0,1,2,3,4,5,6,7,8,]

    const fetch = () => gameboard;

    const update = (player, target) => {
        gameboard[target] = player.value
    }

    const clear = () => {
        gameboard.length = 0
        gameboard.push(0,1,2,3,4,5,6,7,8)
    }

    return {fetch, update, clear};
})();

const gameController = (() => {
    let playerOneName = "playerOne"
    let playerTwoName = "playerTwo"

    const players = [{name: playerOneName, value: 'X'},
                     {name: playerTwoName, value: 'O'}]

    let currentPlayer = players[0]

    const changeTurn = () => {
        if (currentPlayer == players[0]) {
            currentPlayer = players[1]
        } else {
            currentPlayer = players[0]
        }
    }

    const getCurrentPlayer = () => currentPlayer

    const checkState = (player) => {
        const wins = [[0,3,6],[1,4,7],[2,5,8],
                        [0,1,2],[3,4,5],[6,7,8],
                        [0,4,8],[2,4,6]];
        let filled = [];

        const gameboard = gameboardController.fetch()

        let draw = true;
        for (let i = 0; i < gameboard.length; i++) {
            if (gameboard[i] == player.value) {
                filled.push(i)
            }
            if (typeof(gameboard[i]) == "number") {
                draw = false
            }
        }
        if (draw) {
            return "Draw"
        }

        for (let i = 0; i < wins.length; i++) {
            let found = true;
            for (let j = 0; j < 3; j++) {
                if (filled.includes(wins[i][j]) == false) {
                    found = false
                    break
                }
            }
            if (found) {
                return "Win"
            }
        }
        return "Unfinished"
    }

    const playRound = (target) => {
        gameboardController.update(getCurrentPlayer(), target)

        const result = checkState(getCurrentPlayer())
        if (result == "Win") {
            console.log(getCurrentPlayer().name + " wins!")
            gameboardController.clear()
        } else if (result == "Draw") {
            console.log("It's a draw!")
            gameboardController.clear()
        }

        changeTurn()
    }

    return {playRound}
})();

const displayController = (() => {
    const boardDisplay = document.getElementById("board")
    const generate = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div")
            cell.id = i
            cell.addEventListener("click", function(e) {
                input(e.target)
            })
            boardDisplay.appendChild(cell)
        }
    }

    const update = () => {
        const gameboard = gameboardController.fetch()

        for (let i = 0; i < 9; i++) {
            if (typeof(gameboard[i]) != "number") {
                boardDisplay.children[i].innerText = gameboard[i]
            } else {
                boardDisplay.children[i].innerText = ""
            }
        }
    }

    const input = (target) => {
        const gameboard = gameboardController.fetch()
        if (gameboard.includes(parseInt(target.id))) {
            gameController.playRound(target.id)
            update()
        }
    }
    
    generate()

    return {generate, update, input}
})();