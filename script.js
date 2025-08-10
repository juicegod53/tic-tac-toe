const gameboard = (() => {

    const gameboard = [1,2,3,4,5,6,7,8,9]

    const updateGameboard = (player, target) => {
        if (gameboard[target] == "") {
            gameboard[target] = player
        }
    }

    const checkState = (player) => {
        const wins = [[1,4,7],[2,5,8],[3,6,9],
                      [1,2,3],[4,5,6],[7,8,9],
                      [1,5,9],[3,5,7]];
        let filled = [];
        let draw = true;
        for (let i = 0; i < gameboard.length; i++) {
            if (gameboard[i] == player) {
                filled.push(i)
            }
            if (typeof(gameboard[i]) == "number") {
                draw = false
            }
        }
        if (draw) {
            return "Draw"
        }
        let i = 0;
        while (i < wins.length) {
            let j = 0
            while (j < 3) {
                if (filled.includes(wins[i][j]) == false) {
                    j = 0
                    i += 1
                }
                j += 1
                if (j == 3) {
                    return "Win"
                }
            }
        }
    }
    return {updateGameboard, checkState}
})();