const gameboardController = (() => {
    const gameboard = [1,2,3,4,5,6,7,8,9]

    const fetch = () => gameboard;

    const update = (player, target) => {
        if (typeof(gameboard[target]) == "number") {
            gameboard[target] = player.value
        }
    }

    const clear = () => {
        gameboard.length = 0
        gameboard.push(1,2,3,4,5,6,7,8,9)
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
        const wins = [[1,4,7],[2,5,8],[3,6,9],
                        [1,2,3],[4,5,6],[7,8,9],
                        [1,5,9],[3,5,7]];
        let filled = [];

        const gameboard = gameboardController.fetch()

        let draw = true;
        for (let i = 0; i < gameboard.length; i++) {
            if (gameboard[i] == player.value) {
                filled.push(i+1)
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
        console.log(gameboardController.fetch())

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