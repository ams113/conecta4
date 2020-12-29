import './styles/index.css';
// import { createBoard, isBoardFull, isBoardColumnFull, hasFourInline } from './heplers';

const root = document.getElementById('root');

root.innerHTML = `all right`;

var playerOne = ["None", "red", "badge-danger"];
var playerTwo = ["None", "blue", "badge-primary"];
var columns = 6;
var players = [playerOne, playerTwo];
var playerTurn = 0;
var playerCount = 0;
var winner = false;


// Asociar eventos
$('#start').on('click', startGame);
$('#restart').on('click', restartGame);


// Inicio del juego
restartGame();

function restartGame() {
    root.innerHTML = '';
    $('#panel').show();
    $('#game').hide();
    $("#tbody").empty();
    columns = 6;
}
// Funciones del juego
function startGame() {
    // playerOne[0] = prompt("Player One enter your name (you will be red): ")
    playerOne[0] =  $('#player1').val();
	if (playerOne[0]==="") playerOne[0] = "Player 1";
    // playerTwo[0] = prompt("Player One enter your name (you will be blue): ")
    playerTwo[0] =  $('#player2').val();
    if (playerTwo[0]==="") playerTwo[0] = "Player 2";
    var cols =  parseInt($('#cols').val());
    if( cols > 5 &&  cols < 16 ) columns = cols;
    console.log(columns);
    writeTable();
	$('.celda').removeClass("red");
	$('.celda').removeClass("blue");
	playerTurn = 0;
	playerCount = 0;
    winner = 0;
    $('#game').show();
    $('#panel').hide();
	updateMessage();
	$('#winner').hide();
    $('#message').show();
}

function writeTable() {

    var tbody = $('#tbody');
    for (var i = 0; i < columns; i++) {
        var tr = $('<tr/>').appendTo(tbody);
        for (var j = 0; j < columns; j++) {
            tr.append('<td><button class="celda"></button></td>');
        }
    }

    $('.celda').on('click', soltarFicha);
}

function updateMessage() {
	// El badge del alert es el del jugador actual
	$('#playerChip').removeClass(playerOne[2]);
	$('#playerChip').removeClass(playerOne[1]);
	$('#playerChip').addClass(players[playerTurn][2]);
	$('#playerChip').text(players[playerTurn][1] + " chip");
	// El nombre del alert es el del jugador actual
	$('#playerName').text(players[playerTurn][0]);
}

function soltarFicha () {
  	// Suelto ficha
  	if (!winner) {
	  	var table = $("#tablero")[0];
        var col = $(this).parent().index();

	  	for (var i=columns-1;i>=0;i--) {
			// Obtengo el boton pulsado
			if (getChipColor(i,col)=="") {
				setChipColor(i,col);
				checkWin(i,col,players[playerTurn][1]);
				playerTurn = playerTurn===0?1:0;
				updateMessage();
				break;
			}
	  	}
  	}
}

function getChipColor (i,j) {
	var table = $("#tablero")[0];
  	var cell = table.rows[i].cells[j];
	var button = $(cell).find(".celda")
	if ($(button).hasClass("red")) {
		return "red";
	}
	else if ($(button).hasClass("blue")) {
		return "blue";
	}
	else {
		return "";
	}
}

function setChipColor (i,j) {
	var table = $("#tablero")[0];
  	var cell = table.rows[i].cells[j];
	var button = $(cell).find(".celda")
	$(button).addClass(players[playerTurn][1]);
}

function checkWin (i,j,color) {
	if ( checkHorizontal(i,color) || checkVertical(j,color) || checkDiagonal(i,j,color)) {
		winner = true;
		$('#message').hide();
		$('#playerWin').text(players[playerTurn][0]);
		$('#winner').show();
	}
}

function checkHorizontal(row,color) {
	var count = 0;
	var col = 0
	while (col<columns && count<4) {
		if (getChipColor(row,col)===color) 
			count++;
		else 
			count=0;	
		col++;
	}	
	return count===4?true:false;
}

function checkVertical(col,color) {
	var count = 0;
	var row = 0;
	while (row<columns && count<4) {
		if (getChipColor(row,col)===color) 
			count++;
		else 
			count=0;	
		row++;
	}	
	return count===4?true:false;
}

function checkDiagonal(row,col,color) {
	// first try (diagonal izquierda-abajo)
	var count = 0;
	var i = row - 3;
	var j = col - 3;
	while (i<row+4 && j<col+4 && count<4) {
		if (0<=i && i<columns && 0<=j && j<columns) {
			if (getChipColor(i,j)===color) 
				count++;
			else 
				count=0;
		}
		i++; j++; 
	}
	// second try (diagonal derecha-arriba)
	if (count<4) {
		count = 0;
		i = row + 3;
		j = col - 3;
		while (i>row-4 && j<col+4 && count<4) {
			if (0<=i && i<columns && 0<=j && j<columns) {
				if (getChipColor(i,j)===color) 
					count++;
				else 
					count=0;	
			}
			i--; j++; 
		}
	}
	// return
	return count===4?true:false;
}