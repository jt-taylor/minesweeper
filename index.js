var components = {
    num_rows : 20,
    num_col : 20,
    num_bombs : 40,
    bomb: '💣',
    flag: '🚩',
    alive: true,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'turquoise', 6: 'brown', 7: 'pink', 8: 'grey'},
    firstClick : true,
    clickMode : 1 // 1 for left mouse down 3 for right mouse down
}

/*
1 for bomb present
2 for display / clicked / show adjacent bomb count
if i want to do marking
3 for marked w/o bomb
4 for marked with bomb

going to use a seperate array for handling the how many bombs are near
*/
var board;
var boardDisp;
var boardAdj;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("restartGameButton").style.display="none";
    startGame();
});

function startGame() {
    board = new Array(components.num_rows);
    for (i = 0; i < components.num_rows; i++) {
        board[i] = new Array(components.num_col);
        for (j = 0; j < components.num_col; j++)
            board[i][j] = 0;
    }
    boardDisp = new Array(components.num_rows);
    for (i = 0; i < components.num_rows; i++) {
        boardDisp[i] = new Array(components.num_col);
        for (j = 0; j < components.num_col; j++)
            boardDisp[i][j] = 0;
    }
    boardAdj = new Array(components.num_rows);
    for (i = 0; i < components.num_rows; i++) {
        boardAdj[i] = new Array(components.num_col);
        for (j = 0; j < components.num_col; j++)
            boardAdj[i][j] = 0;
    }
    placeBombs(board);
    // init board
    //TODO: Async the game logic out of the ui display
    //place bombs
    let tab = createTable();
    document.getElementById('gameBoard').appendChild(tab);
    countAdjacentBombs();
}

function createTable() {
    var table, row, td;
    table = document.createElement('table');

    for (let i = 0; i < components.num_rows; i++) {
        row = document.createElement('tr');

        for (let j = 0; j < components.num_col; j++) {
            td = document.createElement('td');
            td.id = cellId(i, j);
            cellListener(td, i, j);
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
function  reload() {
    window.location.reload();
}
function gameOver() {
    document.getElementById("onGameFinish").style.display="block";
    document.getElementById("restartGameButton").style.display="block";
}
function toggleCellClick(y, x) {
    if (x < 0 || y < 0)
        return;
    if (y >= components.num_rows || x >= components.num_col)
        return ;
    if (board[y][x] == 2 || board[y][x] == 3 || board[y][x] == 4)
        return;
    board[y][x] = 2;
    if(boardAdj[y][x] == 0) {
        toggleCellClick(y-1, x-1);
        toggleCellClick(y-1, x);
        toggleCellClick(y-1, x+1);
        toggleCellClick(y, x-1);
        toggleCellClick(y, x+1);
        toggleCellClick(y+1, x-1);
        toggleCellClick(y+1, x);
        toggleCellClick(y+1, x+1);
    }
}
function countValidFlags() {
    let countValid = 0;
    let countBad = 0
    for (y =0 ; y< components.num_rows; y++) {
        for(x =0 ; x < components.num_col; x++) {
            if (board[y][x] == 3)
                countBad += 1;
            if (board[y][x] ==  4)
                countValid += 1;
        }
    }
    if (countBad == 0 && countValid == components.num_bombs)
     {
        alert("You win");
        gameOver();
     }
}
function cellListener(td, y, x) {
    td.addEventListener("mousedown", function(event) {
        if (event.which == 1 && event.shiftKey) {
            //console.log("shift mouse down"); 
            if (board[y][x] == 0)
                board[y][x] = 3;
            else if (board[y][x] == 1)
                board[y][x] = 4;
            else if (board[y][x] == 3)
                board[y][x] = 0;
            else if (board[y][x] == 4)
                board[y][x] = 1;
            updateBoard();
            countValidFlags();
        }
        else if (event.which == 1) {
            if (components.firstClick == true) {
                if (board[y][x] == 1) {
                    board[y][x] = 0;
                    countAdjacentBombs();
                }
                components.firstClick = false;
            }
            if (board[y][x] == 1) {
                updateBoardDebug();
                gameOver();
            }
            else {
                toggleCellClick(y, x);
                updateBoard();
            }
        }
        if (event.which == 3) {
            console.log("event.which == 3");
        }
    })
}
function updateBoard() {
    for (y = 0; y < components.num_rows; y++) {
        for (x = 0; x < components.num_col;x++) {
            let tmp = document.getElementById(y + '-' + x);
            if (tmp) {
                switch (board[y][x]) {
                    case 0: {
                        tmp.style.color = "brown";
                        tmp.style.backgroundColor = "brown";
                        tmp.innerHTML = "";
                        break;
                    }
                    case 1: {
                        tmp.style.color = "brown";
                        tmp.style.backgroundColor = "brown";
                        tmp.innerHTML = "";
                        /*
                        tmp.style.color= 'red';
                        tmp.style.backgroundColor = "red";
                        tmp.textContent = components.bomb;
                        */
                        break;
                    }
                    case 2: {
                        tmp.style.color = "black";
                        tmp.style.backgroundColor = "white";
                        if (boardAdj[y][x])
                            tmp.innerHTML = boardAdj[y][x];
                        else   
                            tmp.innerHTML = "";
                        break;
                    }
                    case 3: {
                        tmp.style.color = "black";
                        tmp.style.backgroundColor = "white";
                        tmp.textContent = components.flag;
                        break;
                    }
                    case 4 : {
                        tmp.style.color = "black";
                        tmp.style.backgroundColor = "white";
                        tmp.textContent = components.flag;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }
}
function updateBoardDebug() {
    for (y = 0; y < components.num_rows; y++) {
        for (x = 0; x < components.num_col;x++) {
            let tmp = document.getElementById(y + '-' + x);
            if (tmp) {
                switch (board[y][x]) {
                    case 0: {
                        tmp.style.color = "white";
                        tmp.style.backgroundColor = "white";
                        tmp.innerHTML = "";
                        tmp.textContent = "";
                        break;
                    }
                    case 1: {
                        tmp.style.color= 'red';
                        tmp.style.backgroundColor = "red";
                        tmp.innerHTML = "";
                        tmp.textContent = components.bomb;
                        break;
                    }
                    case 3: {
                        tmp.style.color = "white";
                        tmp.style.backgroundColor = "white";
                        tmp.innerHTML = "";
                        tmp.textContent = "";
                        break;
                    }
                    case 4: {
                        tmp.style.color= 'red';
                        tmp.style.backgroundColor = "red";
                        tmp.innerHTML = "";
                        tmp.textContent = components.bomb;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }
}

//TODO : 
/*
function updateBoard() {
    for (y = 0; y < components.num_rows; y++) {
        for (x = 0; x < components.num_col;x++) {
            let tmp = document.getElementById(y + '-' + x);
            if (tmp) {
                switch (boardDisp[y][x]) {
                    case 0: {
                        break;
                    }
                    case 1: {
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }
}
*/

function countAdjacentBombs() {
    for (y = 0; y < components.num_rows ; y++) {
        for (x = 0 ; x < components.num_col ; x++) {
            if (board[y][x] == 1)  {
                //console.log(y, x);
                if (y == 0 && x == 0) {
                    boardAdj[y][x+1] += 1;
                    boardAdj[y+1][x+1] += 1;
                    boardAdj[y+1][x] += 1;
                } else if (y == 0 && x == components.num_col - 1) {
                    boardAdj[y+1][x] += 1;
                    boardAdj[y][x-1] += 1;
                    boardAdj[y+1][x-1] += 1;
                } else if (y == components.num_rows - 1 && x == 0) {
                    boardAdj[y-1][x] += 1;
                    boardAdj[y][x+1] += 1;
                    boardAdj[y-1][x+1] += 1;
                } else if (y == components.num_rows - 1 && x == components.num_col - 1) {
                    boardAdj[y-1][x] += 1;
                    boardAdj[y][x-1] += 1;
                    boardAdj[y-1][x-1] += 1;
                } else if (y == 0) {
                    boardAdj[y+1][x-1] += 1;
                    boardAdj[y+1][x] += 1;
                    boardAdj[y+1][x+1] += 1;
                    boardAdj[y][x+1] += 1;
                    boardAdj[y][x-1] += 1;
                } else if (x == 0) {
                    boardAdj[y+1][x+1] += 1;
                    boardAdj[y][x+1] += 1;
                    boardAdj[y-1][x+1] += 1;
                    boardAdj[y+1][x] += 1;
                    boardAdj[y-1][x] += 1;
                } else if (y == components.num_rows - 1) {
                    boardAdj[y-1][x-1] += 1;
                    boardAdj[y-1][x] += 1;
                    boardAdj[y-1][x+1] += 1;
                    boardAdj[y][x+1] += 1;
                    boardAdj[y][x-1] += 1;
                } else if (x == components.num_col - 1) {
                    boardAdj[y-1][x-1] += 1;
                    boardAdj[y][x-1] += 1;
                    boardAdj[y+1][x-1] += 1;
                    boardAdj[y-1][x] += 1;
                    boardAdj[y+1][x] += 1;
                }
                else { // not a corner / edge square
                    boardAdj[y-1][x-1] += 1;   
                    boardAdj[y-1][x] += 1;   
                    boardAdj[y-1][x+1] += 1;   
                    boardAdj[y][x-1] += 1;   
                    boardAdj[y][x+1] += 1;   
                    boardAdj[y+1][x-1] += 1;   
                    boardAdj[y+1][x] += 1;   
                    boardAdj[y+1][x+1] += 1;   
                }
            }
        }
    }   
}