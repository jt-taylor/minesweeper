var components = {
    num_rows : 20,
    num_col : 20,
    num_bombs : 40,
    bomb: '💣',
    alive: true,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'turquoise', 6: 'brown', 7: 'pink', 8: 'grey'}
}

document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

function startGame() {
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
            //td.cellIndex(i, j);
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