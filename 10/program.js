import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import { nextTick } from "process";


export async function program_10_A0() {
    const list = await readInput(path.join(__dirName, "10/input_A0.txt"));
    return solveA(list);
}

export async function program_10_A() {
    const list = await readInput(path.join(__dirName, "10/input_A.txt"));
    return solveA(list);
}

export async function program_10_B0() {
    const list = await readInput(path.join(__dirName, "10/input_B0.txt"));
    return solveB(list);
}

export async function program_10_B() {
    const list = await readInput(path.join(__dirName, "10/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let i = 0;
    const problem = parseProblem(list);
    problem.start.symbol = guessSymbol(problem.matrix, problem.start.x, problem.start.y);
    problem.start.type = tileTypes[problem.start.symbol];
    let currentTile = problem.start;
    let prevTile = null;
    do {
        currentTile.num = i;
        currentTile.inLoop = true;
        const nextTile = problem.next(currentTile, prevTile);
        prevTile = currentTile;
        currentTile = nextTile;
        i++;

    } while (!currentTile.equals(problem.start));

    //console.log (problem.toString())

    return i / 2;
}

function solveB(list) {

    // Primero recorremos identificamos el bucle, numerando sus tiles y marcándolas
    // como "pertenecientes al loop"
    let i = 0;
    const problem = parseProblem(list);
    problem.start.symbol = guessSymbol(problem.matrix, problem.start.x, problem.start.y);
    problem.start.type = tileTypes[problem.start.symbol];
    let currentTile = problem.start;
    let prevTile = null;
    do {
        currentTile.num = i;
        currentTile.inLoop = true;
        const nextTile = problem.next(currentTile, prevTile);
        prevTile = currentTile;
        currentTile = nextTile;
        i++;

    } while (!currentTile.equals(problem.start));
    problem.lastTileNum = i - 1;

    console.log(problem.toString())

    // En segundo lugar recorreremos todas las celdas de la matriz que NO ESTEN EN EL BUCLE,
    // y para cada una de ellas, averiguaremos si está "dentro" del bucle o "fuera" del bucle,
    // devolviendo el total de celdas "dentro" del bucle.
    // Para saber si una celda está dentro o fuera del bucle recorreremos un camino recto desde
    // dicha celda hasta una posición en el borde del mapa, y contaremos cuántas veces ese camino
    // "atraviesa" el bucle. Si lo hace un número par de veces, la celda está fuera, y si lo hace
    // un número impar de veces, la celda está dentro.

    let total = 0;
    problem.matrix.forEach(row => {
        row.forEach(tile => {
            if (!tile.inLoop) {
                const nCrosses = countNCrosses(problem, tile);
                if (nCrosses % 2 === 1) {
                    total++;
                }
            }
        });
    });


    return total;
}

function parseProblem(list) {
    const problem = {
        matrix: [],
        start: {},
        next(currentTile, prevTile) {
            // Averiguamos si hay que tirar por "uno" o por "dos"
            let option = 1; // si no hay prevTile, tiramos por "uno".
            if (prevTile) {
                if (currentTile.x + currentTile.type.uno[0] === prevTile.x
                    && currentTile.y + currentTile.type.uno[1] === prevTile.y) {
                    option = 2;
                }
            }
            let nextTile = null;
            if (option === 1) {
                nextTile = this.matrix[currentTile.y + currentTile.type.uno[1]][currentTile.x + currentTile.type.uno[0]];
            } else { // option === 2
                nextTile = this.matrix[currentTile.y + currentTile.type.dos[1]][currentTile.x + currentTile.type.dos[0]];
            }
            return nextTile;
        },

        toString() {
            let result = "";
            this.matrix.forEach(row => {
                let line = "";
                row.forEach(tile => {
                    line += (tile.inLoop ? "#" : tile.symbol);
                });
                result += line + "\n";
            });
            return result;
        }
    };
    let i = 0;
    list.forEach(line => {
        problem.matrix[i] = [];
        const chars = Array.from(line);
        let j = 0;
        chars.forEach(symbol => {
            problem.matrix[i].push(new Tile(j, i, symbol));
            if (symbol === "S") {
                problem.start = problem.matrix[i][j];
            }
            j++
        })
        i++;
    });
    return problem;
}

const tileTypes = {
    "F": { "uno": [1, 0], "dos": [0, 1] },
    "-": { "uno": [-1, 0], "dos": [1, 0] },
    "7": { "uno": [-1, 0], "dos": [0, 1] },
    "|": { "uno": [0, -1], "dos": [0, 1] },
    "J": { "uno": [0, -1], "dos": [-1, 0] },
    "L": { "uno": [1, 0], "dos": [0, -1] }
};

function guessSymbol(matrix, x, y) {
    // Sabemos que en matrix[y][x] hay una "S", y tenemos que devolver
    // que símbolo de "tile" se esconde bajo la "S", mirando los 4 símbolos
    // vecinos.
    // Sabemos que matrix[y][x] está conectado exactamente con 2 de sus 4 vecinos.
    let conectados = {};
    let vIzquierdo = matrix[y][x - 1];
    if (vIzquierdo.symbol === "F" || vIzquierdo.symbol === "-" || vIzquierdo.symbol === "L") {
        // vIzquierdo es uno de los conectados
        conectados.izquierdo = vIzquierdo;
    }
    let vDerecho = matrix[y][x + 1];
    if (vDerecho.symbol === "7" || vDerecho.symbol === "-" || vDerecho.symbol === "J") {
        // vDerecho es uno de los conectados
        conectados.derecho = vDerecho;
    }
    let vArriba = matrix[y - 1][x];
    if (vArriba.symbol === "7" || vArriba.symbol === "|" || vArriba.symbol === "F") {
        // vArriba es uno de los conectados
        conectados.arriba = vArriba;
    }
    let vAbajo = matrix[y + 1][x];
    if (vAbajo.symbol === "L" || vAbajo.symbol === "|" || vAbajo.symbol === "J") {
        // vAbajo es uno de los conectados
        conectados.abajo = vAbajo;
    }
    let symbol = null;
    if (conectados.izquierdo) {
        if (conectados.arriba) symbol = "J";
        else if (conectados.derecho) symbol = "-";
        else symbol = "7"; // abajo
    } else if (conectados.arriba) {
        if (conectados.derecho) symbol = "L";
        else if (conectados.abajo) symbol = "|";
        else symbol = "J"; // izquierdo
    } else if (conectados.derecho) {
        if (conectados.abajo) symbol = "F";
        else if (conectados.izquierdo) symbol = "-";
        else symbol = "J"; // arriba
    } else { // conectados.abajo == true
        if (conectados.izquierdo) symbol = "7";
        else if (conectados.arriba) symbol = "|";
        else symbol = "F";
    }
    return symbol;
}

class Tile {
    constructor(x, y, symbol) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.type = tileTypes[symbol];
        this.num = null;
        this.inLoop = false;
    };

    equals(otherTile) {
        return this.x === otherTile.x && this.y === otherTile.y;
    };

    toString() {
        return this.symbol + " [" + this.x + ", " + this.y + "]" + (this.inLoop ? " #" : "");
    }
}

function countNCrosses(problem, tile) {
    let nCrosses = 0;
    let y = tile.y;
    let prevTile = tile;
    while (y > 0) {
        y--;
        const nextTile = problem.matrix[y][tile.x];
        let contiguous = false;
        if (nextTile.inLoop) {
            if (prevTile.inLoop) {
                if (isContiguous(problem, prevTile, nextTile)) {
                    contiguous = true;
                } else {
                    if (contiguous) {
                        nCrosses++;
                        contiguous = false;
                    }
                    nCrosses++;
                }
            } else {
                nCrosses++;
            }
        } else {
            if (contiguous) {
                nCrosses++;
                contiguous = false;
            }
        }
    }
    return nCrosses;
}

function isContiguous(problem, a, b) {
    // caso especial: la celda con mayor "num" del bucle es contigua con la celda con "num" = 0
    if (a.num === problem.lastTileNum && b.num === 0) return true; 
    if (a.num === 0 && b.num === problem.lastTileNum) return true;
    return (a.num-b.num === 1 || a.num-b.num === -1);
}