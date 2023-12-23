import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import chalk from "chalk";


export async function program_14_A0() {
    const list = await readInput(path.join(__dirName, "14/input_A0.txt"));
    return solveA(list);
}

export async function program_14_A() {
    const list = await readInput(path.join(__dirName, "14/input_A.txt"));
    return solveA(list);
}

export async function program_14_B0() {
    const list = await readInput(path.join(__dirName, "14/input_B0.txt"));
    return solveB(list);
}

export async function program_14_B() {
    const list = await readInput(path.join(__dirName, "14/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list);
    problem.tiltedMatrix = cloneMatrix(problem.matrix);
    tiltNorth(problem.tiltedMatrix);

    console.log(printMatrix(problem.tiltedMatrix))
    
    for (let y=0; y<problem.tiltedMatrix.length; y++) {
        for (let x=0; x<problem.tiltedMatrix[0].length; x++) {
            if (problem.tiltedMatrix[y][x] === "O") {
                total += problem.tiltedMatrix.length - y;
            }
        }
    }
    return total;
}

function parseProblem(list) {
    const problem = {
        matrix: [],
        tiltedMatrix: []
    };
    list.forEach(line => {
        problem.matrix.push(Array.from(line));
    });
    return problem;
}

function tiltNorth(matrix) {
    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 1; y < matrix.length; y++) {
            if (matrix[y][x] == "O") {
                let dropY = y;
                while (dropY-1 >= 0 && matrix[dropY-1][x] === ".") {
                    dropY--
                };
                if (matrix[dropY][x] === ".") {
                    matrix[dropY][x] = "O";
                    matrix[y][x] = ".";
                }
            }
        }
    }
}

function cloneMatrix(m) {
    const clonedM = new Array(m.length);
    for (let i = 0; i < m.length; i++) {
        clonedM[i] = [...m[i]];
    }
    return clonedM;
}

function printMatrix(m) {
    let result = "";
    for (let y = 0; y < m.length; y++) {
        let line = "";
        for (let x = 0; x < m[0].length; x++) {
            line += m[y][x];
        }
        result += line + "\n";
    }
    return result;
}