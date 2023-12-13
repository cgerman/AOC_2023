import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import chalk from "chalk";


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
    // como "pertenecientes al loop".
    // A medida que hacemos ésto, guardamos en un array los vértices del loop
    let i = 0;
    const problem = parseProblem(list);
    problem.start.symbol = guessSymbol(problem.matrix, problem.start.x, problem.start.y);
    problem.start.type = tileTypes[problem.start.symbol];
    problem.polygon = [problem.start];
    let currentTile = problem.start;
    let prevTile = null;
    do {
        currentTile.num = i;
        currentTile.inLoop = true;
        const nextTile = problem.next(currentTile, prevTile);
        if (["F", "7", "J", "L"].includes(nextTile.symbol)) {
            // nextTile es un vértice del loop
            problem.polygon.push(nextTile);
        }
        prevTile = currentTile;
        currentTile = nextTile;
        i++;

    } while (!currentTile.equals(problem.start));
    problem.lastTileNum = i - 1;
    
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
                /*
                const nCrosses = countNCrosses3(problem, tile);
                tile.nCrosses = nCrosses;
                if (nCrosses % 2 === 1) {
                    tile.insideTheLoop = true;
                    total++;
                }
                */
                const inside = pointIsInPoly(tile, problem.polygon);
                if (inside) {
                    tile.insideTheLoop = true;
                    total++;
                }
            }
        });
    });

    // console.log(problem.toString())

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
            const loop = chalk.yellow;
            const inside = chalk.bgGreen;
            const outside = chalk.bgBlack;
            const start = chalk.inverse;
            let result = "";
            this.matrix.forEach(row => {
                let line = "";
                row.forEach(tile => {
                    line += (tile.inLoop ?
                        (tile.equals(this.start) ? start("S") : loop(tile.symbol))
                        : (tile.insideTheLoop != undefined ?
                            inside(tile.nCrosses === undefined ? tile.symbol : tile.nCrosses) :
                            outside(tile.nCrosses === undefined ? tile.symbol : tile.nCrosses)));
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
    if (x - 1 >= 0) {
        let vIzquierdo = matrix[y][x - 1];
        if (vIzquierdo.symbol === "F" || vIzquierdo.symbol === "-" || vIzquierdo.symbol === "L") {
            // vIzquierdo es uno de los conectados
            conectados.izquierdo = vIzquierdo;
        }
    }
    if (x + 1 < matrix[0].length) {
        let vDerecho = matrix[y][x + 1];
        if (vDerecho.symbol === "7" || vDerecho.symbol === "-" || vDerecho.symbol === "J") {
            // vDerecho es uno de los conectados
            conectados.derecho = vDerecho;
        }
    }
    if (y - 1 >= 0) {
        let vArriba = matrix[y - 1][x];
        if (vArriba.symbol === "7" || vArriba.symbol === "|" || vArriba.symbol === "F") {
            // vArriba es uno de los conectados
            conectados.arriba = vArriba;
        }
    }
    if (y + 1 < matrix.length) {
        let vAbajo = matrix[y + 1][x];
        if (vAbajo.symbol === "L" || vAbajo.symbol === "|" || vAbajo.symbol === "J") {
            // vAbajo es uno de los conectados
            conectados.abajo = vAbajo;
        }
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
    while (y >= 0) {
        y--;
        const nextTile = (y === -1 ? new Tile(tile.x, -1, ".") : problem.matrix[y][tile.x]);
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

function countNCrosses2(problem, tile) {
    let contiguous = false;
    let nCrosses = 0;
    let y = tile.y;
    let prevTile = tile;
    while (y >= 0) {
        y--;
        const nextTile = (y === -1 ? new Tile(tile.x, -1, ".") : problem.matrix[y][tile.x]);
        if (prevTile.inLoop) {
            if (nextTile.inLoop) {
                if (isContiguous(problem, nextTile, prevTile)) {
                    contiguous = true;
                } else {
                    if (contiguous) {
                        nCrosses += 2;
                        contiguous = false;
                    } else {
                        nCrosses++;
                    }
                }
            } else {
                if (contiguous) {
                    nCrosses += 2;
                    contiguous = false;
                } else {
                    nCrosses++;
                }
            }
        } else {
            contiguous = false;
        }
        prevTile = nextTile;
    }
    return nCrosses;
}

function isContiguous(problem, a, b) {
    // caso especial: la celda con mayor "num" del bucle es contigua con la celda con "num" = 0
    if (a.num === problem.lastTileNum && b.num === 0) return true;
    if (a.num === 0 && b.num === problem.lastTileNum) return true;
    return (a.num - b.num === 1 || a.num - b.num === -1);
}

function countNCrosses3(problem, tile) {
    // Creamos un "tile" fuera del mapa, con la misma coordenada x que la tile recibida como parámetro
    const exTile = new Tile(tile.x, -1, ".");
    const exLine = [tile, exTile];
    const n = problem.polygon.length;
    let count = 0;
    let i = 0;
    do {
        // Creamos una línea para cada arista del polígono
        const line = [problem.polygon[i], problem.polygon[(i + 1) % n]];
        if (intersects(line, exLine)) {
            if (direction(line[0], tile, line[1]) != 0) {
                count++;
            }
        }
        i = (i + 1) % n;
    } while (i != 0);

    return count;
}

function intersects(line1, line2) {
    const dir1 = direction(line1[0], line1[1], line2[0]);
    const dir2 = direction(line1[0], line1[1], line2[1]);
    const dir3 = direction(line2[0], line2[1], line1[0]);
    const dir4 = direction(line2[0], line2[1], line1[1]);

    // When intersecting
    if (dir1 != dir2 && dir3 != dir4)
        return true;

    // When p2 of line2 are on the line1
    if (dir1 == 0 && onLine(line1, line2[0]))
        return true;

    // When p1 of line2 are on the line1
    if (dir2 == 0 && onLine(line1, line2[1]))
        return true;

    // When p2 of line1 are on the line2
    if (dir3 == 0 && onLine(line2, line1[0]))
        return true;

    // When p1 of line1 are on the line2
    if (dir4 == 0 && onLine(line2, line1[1]))
        return true;

    return false;
}

function direction(a, b, c) {
    const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    if (val == 0) return 0; // Collinear
    else if (val < 0) return 2; // Anti-clockwise direction
    return 1; // Clockwise direction
}

function onLine(line, tile) {
    // Check whether "tile" is on the line or not
    if (tile.x <= Math.max(line[0].x, line[1].x)
        && tile.x >= Math.min(line[0].x, line[1].x)
        && (tile.y <= Math.max(line[0].y, line[1].y)
            && tile.y >= Math.min(line[0].y, line[1].y))) {
        return true;
    }
    return false;
}

function pointIsInPoly(p, polygon) {
    var isInside = false;
    var i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ((polygon[i].y > p.y) != (polygon[j].y > p.y) &&
            p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
            isInside = !isInside;
        }
    }

    return isInside;
}