import path from "path";
import { __dirName, readInput } from "../utils/Utils.js";


export async function program_3_A0() {
    const list = await readInput(path.join(__dirName, "03/input_A0.txt"));
    return solveA(list);
}

export async function program_3_A() {
    const list = await readInput(path.join(__dirName, "03/input_A.txt"));
    return solveA(list);
}

export async function program_3_B0() {
    const list = await readInput(path.join(__dirName, "03/input_B0.txt"));
    return solveB(list);
}

export async function program_3_B() {
    const list = await readInput(path.join(__dirName, "03/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    const problem = parseProblem(list);
    const matrix = problem.matrix;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const c = matrix[y][x];
            if (isSymbol(c)) {
                findPartNumbers(x, y, problem);
            }
        }
    }

    let total = 0;
    problem.partNumbers.forEach((pn) => {
        total += pn.value;
    });
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list);
    const matrix = problem.matrix;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const c = matrix[y][x];
            if (c === '*') {
                const gearRatio = getGearRatio(x, y, problem);
                total += gearRatio;
            }
        }
    }
    return total;
}

function parseProblem(list) {
    const problem = {
        matrix: [],
        numbers: [],
        partNumbers: []
    };
    // primero rellenamos 'matrix'
    let i = 0;
    list.forEach(line => problem.matrix[i++] = Array.from(line));

    // luego, recorremos 'matrix' para encontrar los numeros
    // y con ellos rellenar 'numbers'
    const matrix = problem.matrix;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            if (isDigit(matrix[y][x])) {
                // [x,y] indican las coordenadas del primer dígito de un numero
                let strNumber = "";
                for (i = x; i < matrix[0].length && isDigit(matrix[y][i]); i++) {
                    strNumber = strNumber + matrix[y][i];
                }
                const number = {
                    value: 1 * strNumber, // valor numerico del numero
                    from_x: x,            // posicion x del primer digito del número
                    to_x: i - 1,          // posicion x del último dígiro del número
                    y: y,                 // posición y del número
                    isPartNumber: false
                };
                problem.numbers.push(number);
                x = i - 1; // situamos la 'x' en el último dígito del número para continuar el recirrido a partir de ahí.
            }
        }
    }

    return problem;
}

function findPartNumbers(x, y, problem) {
    // Sabemos que matrix[x,y] es un simbolo.
    // Recorremos los 8 vecinos de [x,y] en busca de dígitos.
    // Para cada dígito encontrado, cogemos el número al que corresponde
    // y lo añadimos al array de partNumbers.
    for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
            const coord_y = y + yy;
            const coord_x = x + xx;
            if (coord_y >= 0 && coord_y < problem.matrix.length) {
                if (coord_x >= 0 && coord_x < problem.matrix[0].length) {
                    if (coord_x != x || coord_y != y) {
                        if (isDigit(problem.matrix[coord_y][coord_x])) {
                            // En matrix[coord_x, coord_y] tenemos un dígito de algun número
                            // Buscamos ese número en problem.numbers, lo marcamos como 'usado' 
                            // para no volverlo a contar, y lo copiamos al array de partNumbers.
                            const number = findNumber(problem.numbers, coord_x, coord_y);
                            if (!number.isPartNumber) {
                                number.isPartNumber = true;
                                const partNumber = { ...number };
                                problem.partNumbers.push(partNumber);
                            }
                        }
                    }
                }
            }
        }
    }
}

function getGearRatio(x, y, problem) {
    // Sabemos que matrix[x,y] es un '*'.
    // Recorremos los 8 vecinos de [x,y] en busca de dígitos.
    // Para cada dígito encontrado, cogemos el partNumber al que corresponde
    // Si hay exactamente 2 partNumbers alrededor de nuestro '*'
    // se considera que el '*' es un gear, y devolvemos su gearRatio.
    // En caso contrario, devolvemos 0
    let gearRatio = 0;
    const gearPartNumbers = [];

    for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
            const coord_y = y + yy;
            const coord_x = x + xx;
            if (coord_y >= 0 && coord_y < problem.matrix.length) {
                if (coord_x >= 0 && coord_x < problem.matrix[0].length) {
                    if (coord_x != x || coord_y != y) {
                        if (isDigit(problem.matrix[coord_y][coord_x])) {
                            // En matrix[coord_x, coord_y] tenemos un dígito de algun partNumber
                            // Buscamos ese número en problem.numbers, lo marcamos como 'usado' 
                            // para no volverlo a contar, y lo copiamos al array gearPartNumbers.
                            const number = findNumber(problem.numbers, coord_x, coord_y);
                            if (!number.isPartNumber) {
                                number.isPartNumber = true;
                                const partNumber = { ...number };
                                gearPartNumbers.push(partNumber);
                            }
                        }
                    }
                }
            }
        }
    }

    if (gearPartNumbers.length === 2) {
        gearRatio = gearPartNumbers[0].value * gearPartNumbers[1].value;
    }

    return gearRatio;       
}

function findNumber(numbers, x, y) {
    let foundNumber = null;
    numbers.forEach(number => {
        if (!foundNumber && number.y === y && number.from_x <= x && number.to_x >= x) {
            foundNumber = number;
        }
    });
    return foundNumber;
}

function isDigit(c) {
    return c >= '0' && c <= '9';
}

function isSymbol(c) {
    return c != '.' && !isDigit(c) && !isAlpha(c);
}

function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

