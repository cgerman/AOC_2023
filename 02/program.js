import path from "path";
import { __dirName, readInput } from "../utils/Utils.js";


export async function program_2_A0() {
    const list = await readInput(path.join(__dirName, "02/input_A0.txt"));
    return solveA(list, { "red": 12, "green": 13, "blue": 14 });
}

export async function program_2_A() {
    const list = await readInput(path.join(__dirName, "02/input_A.txt"));
    return solveA(list, { "red": 12, "green": 13, "blue": 14 });
}

export async function program_2_B0() {
    const list = await readInput(path.join(__dirName, "02/input_B0.txt"));
    return solveB(list);
}

export async function program_2_B() {
    const list = await readInput(path.join(__dirName, "02/input_B.txt"));
    return solveB(list);
}

function solveA(list, bag) {
    let total = 0;
    let gameId = 1;
    list.forEach((line) => {
        let gamePossible = true;
        const extractions = parseExtractions(line);
        extractions.forEach(extraction => {
            if (gamePossible && !extractionPossible(extraction, bag)) {
                gamePossible = false;
            }
        });
        if (gamePossible) {
            total += gameId;
        }
        gameId++;
    });
    return total;
}

function solveB(list) {
    let total = 0;
    let gameId = 1;
    list.forEach((line) => {
        let bag = { "red": 0, "green": 0, "blue": 0 }
        const extractions = parseExtractions(line);
        extractions.forEach(extraction => {
            bag = findMinimumBag(extraction, bag)
        });
        const gamePower = bag["red"] * bag["green"] * bag["blue"];
        total += gamePower;
        gameId++;
    });
    return total;
}

function parseExtractions(line) {
    const parsedExtractions = [];
    const game = line.split(":");
    const extractions = game[1].split(";");
    extractions.forEach(extraction => {
        const parsedExtraction = parseExtraction(extraction.trim());
        parsedExtractions.push(parsedExtraction);
    });
    return parsedExtractions;
}

function parseExtraction(extraction) {
    const result = {};
    const cubes = extraction.split(",");
    cubes.forEach(cube => {
        cube = cube.trim();
        const parts = cube.split(" ");
        result[parts[1].trim()] = 1 * parts[0].trim();
    });
    return result;
}

function extractionPossible(extraction, bag) {
    const nReds = extraction["red"] || 0;
    const nGreens = extraction["green"] || 0;
    const nBlues = extraction["blue"] || 0;
    if (nReds > bag["red"]) return false;
    if (nGreens > bag["green"]) return false;
    if (nBlues > bag["blue"]) return false;
    return true;
}

function findMinimumBag(extraction, bag) {
    const result = { ...bag };
    const nReds = extraction["red"] || 0;
    const nGreens = extraction["green"] || 0;
    const nBlues = extraction["blue"] || 0;
    if (nReds > bag["red"]) result["red"] = nReds;
    if (nGreens > bag["green"]) result["green"] = nGreens;
    if (nBlues > bag["blue"]) result["blue"] = nBlues;
    return result;
}

function printBag(bag) {
    return "{ " + "red: " + bag["red"] + ", green: " + bag["green"] + ", blue: " + bag["blue"] + " }";
}

