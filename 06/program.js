import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";


export async function program_6_A0() {
    const list = await readInput(path.join(__dirName, "06/input_A0.txt"));
    return solveA(list);
}

export async function program_6_A() {
    const list = await readInput(path.join(__dirName, "06/input_A.txt"));
    return solveA(list);
}

export async function program_6_B0() {
    const list = await readInput(path.join(__dirName, "06/input_B0.txt"));
    return solveB(list);
}

export async function program_6_B() {
    const list = await readInput(path.join(__dirName, "06/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 1;
    const problem = parseProblem(list, 'A');
    problem.forEach(race => {
        const numberOfWinningPossibilities = race.rMax - race.rMin + 1;
        total *= numberOfWinningPossibilities;
    });

    return total;
}

function solveB(list) {
    let total = 1;
    const problem = parseProblem(list, 'B');
    problem.forEach(race => {
        const numberOfWinningPossibilities = race.rMax - race.rMin + 1;
        total *= numberOfWinningPossibilities;
    });

    return total;
}

function parseProblem(list, step) {
    const problem = [];
    const lines = list.toArray();
    let timeArray = [];
    if (step === 'A') {
        timeArray = lines[0].split(":")[1].split(' ').filter(x => x.length > 0);
    } else {
        timeArray.push(lines[0].split(":")[1].replace(/ /g, ""));
    }
    let distanceArray = [];
    if (step === 'A') {
        distanceArray = lines[1].split(":")[1].split(' ').filter(x => x.length > 0);
    } else {
        distanceArray.push(lines[1].split(":")[1].replace(/ /g, ""));
    }
    if (timeArray.length != distanceArray.length) {
        throw new Error("Error en el formato del fichero. Cada carrera tiene que tener su 'time' y su 'distance'");
    }
    for (let i = 0; i < timeArray.length; i++) {
        const time = 1 * timeArray[i];
        const distance = 1 * distanceArray[i];
        let rMax = (time + Math.sqrt(time * time - 4 * distance)) / 2;
        if (Number.isInteger(rMax)) rMax = rMax - 1;
        else rMax = Math.floor(rMax);

        let rMin = (time - Math.sqrt(time * time - 4 * distance)) / 2;
        if (Number.isInteger(rMin)) rMin = rMin + 1;
        else rMin = Math.ceil(rMin);

        const race = {
            time,
            distance,
            rMin,
            rMax,
            toString: function () {
                return "time: " + this.time + ", distance: " + this.distance + ", rMin: " + this.rMin + ", rMax: " + this.rMax;
            }
        }
        problem.push(race);
    }
    return problem;
}


