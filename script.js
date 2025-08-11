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
    let playerOneName = "Player 1"
    let playerTwoName = "Player 2"

    const players = [{name: playerOneName, value: 'X', score: 0},
                     {name: playerTwoName, value: 'O', score: 0}]

    let currentPlayer = players[0]

    const changeTurn = () => {
        if (currentPlayer == players[0]) {
            currentPlayer = players[1]
        } else {
            currentPlayer = players[0]
        }
    }

    const getCurrentPlayer = () => currentPlayer

    const updateNames = (p1name, p2name) => {
        players[0].name = p1name
        players[1].name = p2name
        if (p1name == "") {
            players[0].name = "Player 1"
        }
        if (p2name == "") {
            players[1].name = "Player 2"
        }
    }

    const getNames = () => [players[0].name, players[1].name]
    const getScores = () => [players[0].score, players[1].score]
    const resetScores = () => {
        players[0].score = 0
        players[1].score = 0
    }

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
        
        if (draw) {
            return "Draw"
        }

        return "Unfinished"
    }

    const playRound = (target) => {
        gameboardController.update(getCurrentPlayer(), target)

        const result = checkState(getCurrentPlayer())
        displayController.displayResult(result)

        changeTurn()
    }

    return {playRound, updateNames, getScores, getNames, resetScores, getCurrentPlayer}
})();

const displayController = (() => {
    let start = false

    const checkStart = () => start
    const activateStart = () => {
        start = true
        gameController.updateNames(document.getElementById("p1").value, document.getElementById("p2").value)
        updateScores()
    }

    const updateScores = () => {
        const scores = gameController.getScores()
        const names = gameController.getNames()
        document.getElementById("p1score").innerText = names[0] + "'s score: " + scores[0]
        document.getElementById("p2score").innerText = names[1] + "'s score: " + scores[1]
    }

    const resetGame = () => {
        start = false
        gameboardController.clear()
        gameController.resetScores()
        gameController.updateNames("Player 1","Player 2")
        updateScores()
        document.getElementById("p1").value = ""
        document.getElementById("p2").value = ""
        generate()
    }

    const displayResult = (result) => {
        if (result == "Win") {
            document.getElementById("result").innerText = gameController.getCurrentPlayer().name + " wins!"
            gameController.getCurrentPlayer().score += 1

        } else if (result == "Draw") {
            document.getElementById("result").innerText = "It's a draw!"
        }

        if (result != "Unfinished") {
            document.getElementById("board").style.pointerEvents = "none"
            document.getElementById("display").style.display = "none"

            const next = document.createElement("button")
            next.setAttribute("id", "next")
            next.innerText = "Next Game"

            next.addEventListener("click", function() {
                gameboardController.clear()
                update()
                updateScores()

                document.getElementById("board").style.pointerEvents = "auto"
                document.getElementById("display").style.display = "flex"
                document.getElementById("result").innerText = ""

                next.remove()
            })

            document.body.appendChild(next)
        }
    }

    const boardDisplay = document.getElementById("board")
    const generate = () => {
        boardDisplay.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div")
            cell.id = i
            cell.addEventListener("click", function(e) {
                input(e.target)
            })
            boardDisplay.appendChild(cell)
        }

        document.getElementById("start").addEventListener("click", activateStart)
        document.getElementById("reset").addEventListener("click", resetGame)
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
        if (gameboard.includes(parseInt(target.id)) && checkStart() == true) {
            gameController.playRound(target.id)
            update()
        }
    }

    generate()

    return {update, updateScores, displayResult}
})();