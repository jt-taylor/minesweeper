var components = {
    num_rows : 20,
    num_col : 20,
    num_bombs : 40,
    bomb: '💣',
    alive: true,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'turquoise', 6: 'brown', 7: 'pink', 8: 'grey'}
}
var board;


document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

function startGame() {
    board = new Array(components.num_rows);
    for (i = 0; i < components.num_rows; i++) {
        board[i] = new Array(components.num_col);
        for (j = 0; j < components.num_col; j++)
            board[i][j] = 0;
    }
    placeBombs(board);
    // init board
    //TODO: Async the game logic out of the ui display
    //place bombs
    let tab = createTable();
    document.getElementById('gameBoard').appendChild(tab);
}

function createTable() {
    var table, row, td;
    table = document.createElement('table');

    for (let i = 0; i < components.num_rows; i++) {
        row = document.createElement('tr');

        for (let j = 0; j < components.num_col; j++) {
            td = document.createElement('td');
            td.id = cellId(i, j);
            row.appendChild(td);
            //add the event listeners to handle mouse click
        }
        table.appendChild(row);
    }
    //table.style.marginLeft="auto";
    //table.style.marginRight="auto";
    return table;
}

function cellId(i, j) {
    return i + '-' + j;
}

/*
Placing them randomly has problems when large percentages of the board are bombs
*/
function placeBombs() {
    for (i = 0; i < components.num_bombs; ) {
        let x = Math.floor(Math.random() * components.num_col);
        let y = Math.floor(Math.random() * components.num_rows);
        if (y < 0 || x < 0 )
            continue;
        if (y >= components.num_rows || x >= components.num_col)
            continue;
        if (board[y][x] == 0)
            board[y][x] = 1;
        else
            continue;
        i++;
    }
    return board;
}
function printBoard() {
    for (y = 0; y < components.num_rows; y++) {
        for (x = 0; x < components.num_col; x++) {
            console.log(board);
        }
    }
}