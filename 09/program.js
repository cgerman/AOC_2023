import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import { nextTick } from "process";


export async function program_9_A0() {
    const list = await readInput(path.join(__dirName, "09/input_A0.txt"));
    return solveA(list);
}

export async function program_9_A() {
    const list = await readInput(path.join(__dirName, "09/input_A.txt"));
    return solveA(list);
}

export async function program_9_B0() {
    const list = await readInput(path.join(__dirName, "09/input_B0.txt"));
    return solveB(list);
}

export async function program_9_B() {
    const list = await readInput(path.join(__dirName, "09/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list);
    problem.forEach(row => {        
        const v = nextValueA(row);
        total += v;
    });
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list);
    problem.forEach(row => {        
        const v = nextValueB(row);
        total += v;
    });
    return total;
}

function parseProblem(list) {
    const lines = list.toArray();
    const problem = [];
    lines.forEach(line => {
        const parts = line.split(" ");
        const history = parts.map(part => 1 * part);
        problem.push(history);
    });
    return problem;
}

function nextRow(row) {
    const result = [];
    for (let i = 1; i < row.length; i++) {
        const value = row[i] - row[i - 1];
        result.push(value);
    }
    return result;
}

function zero(row) {
    const sum = row.reduce((acc, current) => {
        return acc + current;
    }, 0);
    return sum === 0;
}

function nextValueA(row) {
    if (zero(row)) return 0;
    const row2 = nextRow(row);
    const v2 = nextValueA(row2);
    const v = row[row.length-1];
    return v + v2;
}

function nextValueB(row) {
    if (zero(row)) return 0;
    const row2 = nextRow(row);
    const v2 = nextValueB(row2);
    const v = row[0];
    return v - v2;
}