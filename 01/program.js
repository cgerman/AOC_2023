import path from "path";
import { __dirName, readInput } from "../utils/Utils.js";

const digitsA = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9
};
const digitsB = {
    ...digitsA,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
};

export async function program_1_A0() {
    const list = await readInput(path.join(__dirName, "01/input_A0.txt"));
    return solve(list, digitsA);
}

export async function program_1_A() {
    const list = await readInput(path.join(__dirName, "01/input_A.txt"));
    return solve(list, digitsA);
}

export async function program_1_B0() {
    const list = await readInput(path.join(__dirName, "01/input_B0.txt"));
    return solve(list, digitsB);
}

export async function program_1_B() {
    const list = await readInput(path.join(__dirName, "01/input_B.txt"));
    return solve(list, digitsB);
}

function solve(list, digits) {
    let total = 0;
    list.forEach((line) => {
        const first = getFirstDigit(line, digits);
        const last = getLastDigit(line, digits);
        const num = first + "" + last;
        total += (1 * num);
    });
    return total;
}

function getFirstDigit(line, digits) {
    let pos = line.length;
    let digit = 0;
    for (let d in digits) {
        const position = line.indexOf(d);
        if (position != -1 && position < pos) {
            pos = position;
            digit = digits[d];
        }
    }
    return pos === line.length ? null : digit;
}

function getLastDigit(line, digits) {
    let pos = -1;
    let digit = 0;
    for (let d in digits) {
        const position = line.lastIndexOf(d);
        if (position != -1 && position > pos) {
            pos = position;
            digit = digits[d];
        }
    }
    return pos === -1 ? null : digit;
}