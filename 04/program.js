import path from "path";
import { __dirName, readInput } from "../utils/Utils.js";


export async function program_4_A0() {
    const list = await readInput(path.join(__dirName, "04/input_A0.txt"));
    return solveA(list);
}

export async function program_4_A() {
    const list = await readInput(path.join(__dirName, "04/input_A.txt"));
    return solveA(list);
}

export async function program_4_B0() {
    const list = await readInput(path.join(__dirName, "04/input_B0.txt"));
    return solveB(list);
}

export async function program_4_B() {
    const list = await readInput(path.join(__dirName, "04/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list);
    problem.forEach(card => {
        total += cardScore(card);
    });
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list);
    // Recorremos las cartas para obtener las copias
    for (let i = 0; i < problem.length; i++) {
        const card = problem[i];
        const nWinners = getNumberOfWinners(card);
        for (let j = 1; j <= nWinners && i + j < problem.length; j++) {
            problem[i + j].count += card.count;
        }
    }
    // Recorremos las cartas y sumamos el número de copias
    problem.forEach(card => {
        total += card.count;
    });
    return total;
}

function parseProblem(list) {
    const problem = [];
    list.forEach(line => {
        const card = {
        };
        const cardParts = line.split(':');
        card.name = cardParts[0];
        const cardNumberSets = cardParts[1].trim().split('|');
        card.winningNumbers = cardNumberSets[0].trim().split(' ').filter(e => e.length > 0);
        card.numbersIHave = cardNumberSets[1].trim().split(' ').filter(e => e.length > 0);
        card.count = 1;
        card.toString = function () {
            return this.name + " (" + this.count + " copies) : { Winning: " + this.winningNumbers + " -- I have: " + this.numbersIHave + " }";
        }
        problem.push(card);
    });
    return problem;
}

function cardScore(card) {
    const nWinners = getNumberOfWinners(card);
    if (nWinners <= 0) return 0;
    return 2 ** (nWinners - 1);
}

function getNumberOfWinners(card) {
    let total = 0;
    card.numbersIHave.forEach(n => {
        if (card.winningNumbers.includes(n)) {
            total++;
        }
    });
    return total;
}