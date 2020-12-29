// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"TSA1":[function(require,module,exports) {

},{}],"Focm":[function(require,module,exports) {
"use strict";

require("./styles/index.css");

// import { createBoard, isBoardFull, isBoardColumnFull, hasFourInline } from './heplers';
var root = document.getElementById('root');
root.innerHTML = "all right";
var playerOne = ["None", "red", "badge-danger"];
var playerTwo = ["None", "blue", "badge-primary"];
var columns = 6;
var players = [playerOne, playerTwo];
var playerTurn = 0;
var playerCount = 0;
var winner = false; // Asociar eventos

$('#start').on('click', startGame);
$('#restart').on('click', restartGame); // Inicio del juego

restartGame();

function restartGame() {
  root.innerHTML = '';
  $('#panel').show();
  $('#game').hide();
  $("#tbody").empty();
  columns = 6;
} // Funciones del juego


function startGame() {
  // playerOne[0] = prompt("Player One enter your name (you will be red): ")
  playerOne[0] = $('#player1').val();
  if (playerOne[0] === "") playerOne[0] = "Player 1"; // playerTwo[0] = prompt("Player One enter your name (you will be blue): ")

  playerTwo[0] = $('#player2').val();
  if (playerTwo[0] === "") playerTwo[0] = "Player 2";
  var cols = parseInt($('#cols').val());
  if (cols > 5 && cols < 16) columns = cols;
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
  $('#playerChip').text(players[playerTurn][1] + " chip"); // El nombre del alert es el del jugador actual

  $('#playerName').text(players[playerTurn][0]);
}

function soltarFicha() {
  // Suelto ficha
  if (!winner) {
    var table = $("#tablero")[0];
    var col = $(this).parent().index();

    for (var i = columns - 1; i >= 0; i--) {
      // Obtengo el boton pulsado
      if (getChipColor(i, col) == "") {
        setChipColor(i, col);
        checkWin(i, col, players[playerTurn][1]);
        playerTurn = playerTurn === 0 ? 1 : 0;
        updateMessage();
        break;
      }
    }
  }
}

function getChipColor(i, j) {
  var table = $("#tablero")[0];
  var cell = table.rows[i].cells[j];
  var button = $(cell).find(".celda");

  if ($(button).hasClass("red")) {
    return "red";
  } else if ($(button).hasClass("blue")) {
    return "blue";
  } else {
    return "";
  }
}

function setChipColor(i, j) {
  var table = $("#tablero")[0];
  var cell = table.rows[i].cells[j];
  var button = $(cell).find(".celda");
  $(button).addClass(players[playerTurn][1]);
}

function checkWin(i, j, color) {
  if (checkHorizontal(i, color) || checkVertical(j, color) || checkDiagonal(i, j, color)) {
    winner = true;
    $('#message').hide();
    $('#playerWin').text(players[playerTurn][0]);
    $('#winner').show();
  }
}

function checkHorizontal(row, color) {
  var count = 0;
  var col = 0;

  while (col < columns && count < 4) {
    if (getChipColor(row, col) === color) count++;else count = 0;
    col++;
  }

  return count === 4 ? true : false;
}

function checkVertical(col, color) {
  var count = 0;
  var row = 0;

  while (row < columns && count < 4) {
    if (getChipColor(row, col) === color) count++;else count = 0;
    row++;
  }

  return count === 4 ? true : false;
}

function checkDiagonal(row, col, color) {
  // first try (diagonal izquierda-abajo)
  var count = 0;
  var i = row - 3;
  var j = col - 3;

  while (i < row + 4 && j < col + 4 && count < 4) {
    if (0 <= i && i < columns && 0 <= j && j < columns) {
      if (getChipColor(i, j) === color) count++;else count = 0;
    }

    i++;
    j++;
  } // second try (diagonal derecha-arriba)


  if (count < 4) {
    count = 0;
    i = row + 3;
    j = col - 3;

    while (i > row - 4 && j < col + 4 && count < 4) {
      if (0 <= i && i < columns && 0 <= j && j < columns) {
        if (getChipColor(i, j) === color) count++;else count = 0;
      }

      i--;
      j++;
    }
  } // return


  return count === 4 ? true : false;
}
},{"./styles/index.css":"TSA1"}]},{},["Focm"], null)