import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import chalk from "chalk";


export async function program_11_A0() {
    const list = await readInput(path.join(__dirName, "11/input_A0.txt"));
    return solveA(list);
}

export async function program_11_A() {
    const list = await readInput(path.join(__dirName, "11/input_A.txt"));
    return solveA(list);
}

export async function program_11_B0() {
    const list = await readInput(path.join(__dirName, "11/input_B0.txt"));
    return solveB(list);
}

export async function program_11_B() {
    const list = await readInput(path.join(__dirName, "11/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list, 1);
    for (let i = 0; i < problem.galaxies.length; i++) {
        for (let j = i + 1; j < problem.galaxies.length; j++) {
            // Tenemos la pareja de galaxias problem.galaxies[i] y problem.galaxies[j]
            const dist = distance(problem.galaxies[i], problem.galaxies[j]);
            total += dist;
        }
    }
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list, 999999);
    for (let i = 0; i < problem.galaxies.length; i++) {
        for (let j = i + 1; j < problem.galaxies.length; j++) {
            // Tenemos la pareja de galaxias problem.galaxies[i] y problem.galaxies[j]
            const dist = distance(problem.galaxies[i], problem.galaxies[j]);
            total += dist;
        }
    }
    return total;
}

function parseProblem(list, expansionFactor) {
    const problem = {
        galaxies: [],
        rowExpansions: [],
        colExpansions: []
    };
    const tmp = list.toArray();
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = Array.from(tmp[i]);
        const nGalaxies = countGalaxiesInRow(tmp[i]);
        if (nGalaxies === 0) {
            problem.rowExpansions.push({
                position: i
            });
        }
    }
    for (let j = 0; j < tmp[0].length; j++) {
        const nGalaxies = countGalaxiesInColumn(tmp, j);
        if (nGalaxies === 0) {
            problem.colExpansions.push({
                position: j
            });
        }
    }

    let idGalaxy = 1;
    for (let row = 0; row < tmp.length; row++) {
        for (let col = 0; col < tmp[0].length; col++) {
            if (tmp[row][col] === "#") {
                const expandedCol = expand(col, problem.colExpansions, expansionFactor);
                const expandedRow = expand(row, problem.rowExpansions, expansionFactor);
                problem.galaxies.push({
                    initialX: col,
                    initialY: row,
                    x: expandedCol,
                    y: expandedRow,
                    idGalaxy,
                    toString: function () {
                        return "Galaxy " + this.idGalaxy + " [" + this.x + ", " + this.y + "], initially [" + this.initialX + ", " + this.initialY + "]";
                    }
                });
                idGalaxy++;
            }
        }
    }
    return problem;
}

function countGalaxiesInRow(row) {
    return row.reduce((total, char) => {
        return (char === "#" ? total + 1 : total)
    }, 0);
}

function countGalaxiesInColumn(matrix, colIdx) {
    let nGalaxies = 0;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][colIdx] == "#") nGalaxies++;
    }
    return nGalaxies;
}

function distance(a, b) {
    let d = (b.x > a.x ? b.x - a.x : a.x - b.x);
    d += (b.y > a.y ? b.y - a.y : a.y - b.y);
    return d;
}

function expand(position, expansions, expansionFactor) {
    let result = position;
    expansions.forEach(expansion => {
        if (expansion.position <= position) {
            result += expansionFactor;
        }
    });
    return result;
}