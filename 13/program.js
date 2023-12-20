import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import chalk from "chalk";


export async function program_13_A0() {
    const list = await readInput(path.join(__dirName, "13/input_A0.txt"));
    return solveA(list);
}

export async function program_13_A() {
    const list = await readInput(path.join(__dirName, "13/input_A.txt"));
    return solveA(list);
}

export async function program_13_B0() {
    const list = await readInput(path.join(__dirName, "13/input_B0.txt"));
    return solveB(list);
}

export async function program_13_B() {
    const list = await readInput(path.join(__dirName, "13/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list);

    problem.patterns.forEach(pattern => {
        const n = solvePattern(pattern);
        total += n;
    });

    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list);

    problem.patterns.forEach(pattern => {
        // Poblamos el oldMmirror, para luego incorporar el "smudge" 
        // y ver si hay newMirror diferente de oldMirror 
        solvePattern(pattern);
        const n = solvePattern2(pattern);
        console.log(pattern.toString() + "\n" +
            "newMirror: " + n + "\n" +
            "smudge: " + pattern.smudge + "\n");
        total += n;
    });

    return total;
}

function parseProblem(list) {
    const problem = {
        patterns: []
    };

    let matrix = [];
    list.forEach(line => {
        if (line === "") {
            const pattern = new Pattern(matrix);
            problem.patterns.push(pattern);
            matrix = [];
        } else {
            matrix.push(Array.from(line));
        }
    });
    const pattern = new Pattern(matrix);
    problem.patterns.push(pattern);

    return problem;
}

class Pattern {
    constructor(matrix) {
        this.matrix = matrix;
    };

    transpon() {
        const transpuesta = [];
        for (let x = 0; x < this.matrix[0].length; x++) {
            const row = [];
            for (let y = this.matrix.length - 1; y >= 0; y--) {
                row.push(this.matrix[y][x]);
            }
            transpuesta.push(row);
        }
        return transpuesta;
    }

    toString() {
        let result = "";
        for (let y = 0; y < this.matrix.length; y++) {
            const row = this.matrix[y];
            let line = (y + 1).toString().padStart(2, " ") + " ";
            for (let x = 0; x < row.length; x++) {
                line += row[x];
                if (this.mirror < 100 && x + 1 === this.mirror) {
                    line += "|";
                }
            }
            result += line + " " + (y + 1) + "\n";
            if (this.mirror > 100 && y + 1 === this.mirror) {
                result += "   " + Array(row.length).fill("-");
            }
        }
        return result +
            (this.mirror ? "oldMirror: " + this.mirror : "");
    }
}

function matrixToString(matrix) {
    let result = "";
    matrix.forEach(row => {
        const line = row.reduce((str, c) => str + c, "");
        result += line + "\n";
    });
    return result;
}

function solvePattern(pattern) {
    // Primero examina horizontalmente y, si no encuentra espejo, examina verticalmente
    let solution = 100 * solveMatrix(pattern.matrix);
    if (solution === 0) {
        const transpuesta = pattern.transpon();
        solution = solveMatrix(transpuesta);
    }
    pattern.mirror = solution;
    return solution;
}

// Busca el espejo en la matriz recibida, y devuelve el número de filas arriba del espejo
// Devuelve 0 si no encuentra el espejo. 
function solveMatrix(matrix) {
    // Recorremos las filas de matrix buscando dos filas iguales contiguas
    let i = 0;
    for (; i < matrix.length - 1; i++) {
        if (equalRows(matrix[i], matrix[i + 1])) {
            // Hay 2 filas iguales contiguas, ahora hay que comprobar que las
            // filas por arriba y por abajo de esa pareja tambien son iguales,
            // y así indefinidamente hasta que llegamos a un borde de matrix.
            // Por claridad, resolveremos ésto en una función a parte.
            const espejo = comprobarEspejo(matrix, i);
            if (espejo) {
                return i + 1;
            }
        }
    }
    // Si llegamos aquí, o bien no hay 2 filas iguales contiguas, o 
    // sí las hay pero no constituyen un "espejo" ==> matrix no tiene solucion
    return 0;
}

// Devuelve true si r1 y r2 son iguales; false en caso contrario
function equalRows(r1, r2) {
    if (r1.length != r2.length) throw new Error("Se supone que esto no puede pasar");
    for (let i = 0; i < r1.length; i++) {
        if (r1[i] != r2[i]) {
            return false;
        }
    }
    return true;
}

// Recibimos una matrix con dos filas iguales contiguas (matrix[pos] y matrix[pos+1])
// Comprobaremos si las filas por arriba y por abajo de esa pareja tambien son iguales,
// y así indefinidamente hasta que llegamos a un borde de matrix. (condicion de "espejo")
// Devolveremos true si matrix es un espejo y false si no lo es.
function comprobarEspejo(matrix, pos) {
    for (let inc = 1, i = pos - 1, j = pos + 2; i >= 0 && j < matrix.length; inc++, i = pos - inc, j = pos + 1 + inc) {
        if (!equalRows(matrix[i], matrix[j])) {
            return false;
        }
    }
    return true;
}

function flip(matrix, row, col) {
    if (matrix[row][col] === ".") {
        matrix[row][col] = "#";
    } else {
        matrix[row][col] = ".";
    }
}

function solvePattern2(pattern) {
    // Primero examina horizontalmente y, si no encuentra espejo, examina verticalmente
    let oldMirror = pattern.mirror > 100 ? pattern.mirror / 100 : undefined;
    let solution = solveMatrix2(pattern.matrix, oldMirror);
    let newMirror = 100 * solution.mirror;
    if (newMirror === 0) {
        const transpuesta = pattern.transpon();
        oldMirror = pattern.mirror > 100 ? undefined : pattern.mirror;
        solution = solveMatrix2(transpuesta, oldMirror);
        newMirror = solution.mirror;
    }
    if (solution.smudge) {
        pattern.smudge = solution.smudge;
    }
    return newMirror;
}

function solveMatrix2(matrix, oldMirror) {
    // Provocamos un "smudge" en cada punto de la matriz, y comprobamos si hay espejo en 
    // la matriz resultante que dea diferente de oldMirror
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            flip(matrix, y, x);
            const n = solveMatrix(matrix);
            // deshacemos el "flip"
            flip(matrix, y, x);
            if (n > 0 && n != oldMirror) {
                return { mirror: n, smudge: "[y=" + y + ", x=" + x + "]" };
            }
        }
    }

    // si llegamos aquí, significa que ningun "smudge" en esta matrix lleva a un "espejo"
    return { mirror: 0 };

}
