'use strict';
const view = {
        displayMessage(msg) {
            const messageArea = document.getElementById('messageArea');
            messageArea.innerHTML = msg;
        },
        displayHit(location) {
            const cell = document.getElementById(location);
            cell.setAttribute('class', 'hit');
        },
        displayMiss(location) {
            const cell = document.getElementById(location);
            cell.setAttribute('class', 'miss');
        }
    },
    model = {
        boardSize  : 7,
        numShips   : 3,
        shipLength : 3,
        shipsSunk  : 0,
        ships      : [{ locations : [0, 0, 0],
            hits      : ['', '', ''] },
        { locations : [0, 0, 0],
            hits      : ['', '', ''] },
        { locations : [0, 0, 0],
            hits      : ['', '', ''] }],
        fire(guess) {
            for (let i = 0; i < this.numShips; i += 1) {
                const ship = this.ships[i];
                const locations = ship.locations;
                const index = locations.indexOf(guess);
                if (index >= 0) {
                    ship.hits[index] = 'hit';
                    view.displayHit(guess);
                    view.displayMessage('HIT!');
                    if (this.isSunk(ship)) {
                        view.displayMessage('You sank my battleship!');
                        this.shipsSunk += 1;
                    }
                    return true;
                }
            }
            view.displayMiss(guess);
            view.displayMessage('You missed.');
            return false;
        },
        isSunk(ship) {
            for (let i = 0; i < this.shipLength; i += 1) {
                if (ship.hits[i] !== 'hit') {
                    return false;
                }
            }
            return true;
        },
        generateShipLocations() {
            let locations;
            for (let i = 0; i < this.numShips; i += 1) {
                do {
                    locations = this.generateShip();
                } while (this.collision(locations));
                this.ships[i].locations = locations;
            }
        },
        generateShip() {
            const direction = Math.floor(Math.random() * 2);
            let row;
            let col;

            if (direction === 1) {
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            }
            else {
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                col = Math.floor(Math.random() * this.boardSize);
            }

            const newShipsLocations = [];
            for (let i = 0; i < this.shipLength; i += 1) {
                if (direction === 1) {
                    newShipsLocations.push(String(row) + (col + i));
                }
                else {
                    newShipsLocations.push(String(row + i) + col);
                }
            }
            return newShipsLocations;
        },
        collision(locations) {
            for (let i = 0; i < this.numShips; i += 1) {
                const ship = model.ships[i];
                for (let jet = 0; jet < locations.length; jet += 1) {
                    if (ship.locations.indexOf(locations[jet]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    controller = {
        guesses      : 0,
        processGuess(guess) {
            const location = parseGuess(guess);
            if (location) {
                this.guesses += 1;
                const hit = model.fire(location);
                if (hit && model.shipsSunk === model.numShips) {
                    view.displayMessage('You sank all my battleships, in ' + this.guesses + 'guesses');
                }
            }
        }
    };

const parseGuess = function (guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        /*  global customAlert:true  */
        customAlert('Oops, please enter a letter and a number on the board.');
    }
    else {
        const firstChar = guess.charAt(0);
        const row = alphabet.indexOf(firstChar);
        const column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            customAlert('Oops, that isnt on the board.');
        }
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            customAlert('Oops, thats off the board!');
        }
        else {
            return row + column;
        }
    }
    return null;
};

const handleFireButton = function () {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
};

const handleKeyPress = function (enty) {
    const fireButton = document.getElementById('fireButton');
    if (enty.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

const init = function () {
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
};

window.onload = init;
