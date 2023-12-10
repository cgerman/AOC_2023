import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";


export async function program_8_A0() {
    const list = await readInput(path.join(__dirName, "08/input_A0.txt"));
    return solveA(list);
}

export async function program_8_A() {
    const list = await readInput(path.join(__dirName, "08/input_A.txt"));
    return solveA(list);
}

export async function program_8_B0() {
    const list = await readInput(path.join(__dirName, "08/input_B0.txt"));
    return solveB(list);
}

export async function program_8_B() {
    const list = await readInput(path.join(__dirName, "08/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list, "A");
    let nodes = problem.startingPoints;
    for (let i = 0; !endConditionA(nodes); i = (i + 1) % problem.directions.length) {
        const direction = problem.directions[i];
        nodes = runOneStep(problem, nodes, direction);
        total++;
    }
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list, "B");
    let nodes = problem.startingPoints;
    for (let i = 0; !endConditionB(nodes); i = (i + 1) % problem.directions.length) {
        const direction = problem.directions[i];
        nodes = runOneStep(problem, nodes, direction);
        total++;
    }
    return total;
}

function parseProblem(list, step) {
    const lines = list.toArray();
    const problem = {
        directions: [...lines[0]],
        nodes: parseNodes(lines)
    };
    if (step === "A") {
        problem.startingPoints = findStartingPointsA(problem);
    } else {
        problem.startingPoints = findStartingPointsB(problem);
    }
    return problem;
}

function parseNodes(lines) {
    const result = {};
    for (let i = 2; i < lines.length; i++) {
        const strNode = lines[i];
        const node = {
            label: "",
            nextLeft: "",
            nextRight: "",
            next: function (d) {
                if (d === "R") {
                    return this.nextRight;
                } else {
                    return this.nextLeft;
                }
            },
            toString: function () {
                return "label: " + this.label + ", left: " + this.nextLeft + ", right: " + this.nextRight
            }
        };
        const nodeParts = strNode.split("=");
        node.label = nodeParts[0].trim();
        const strDirections = nodeParts[1].trim();
        const directionParts = strDirections.split(",");
        node.nextLeft = directionParts[0].substring(1);
        node.nextRight = directionParts[1].trim().substring(0, 3);
        result[node.label] = node;
    }
    return result;
}

function findStartingPointsA(problem) {
    const result = [];
    result.push(problem.nodes["AAA"]);
    return result
}

function findStartingPointsB(problem) {
    const result = [];
    for (var label in problem.nodes) {
        const node = problem.nodes[label];
        if (label.endsWith("A")) {
            result.push(node);
        }
    }
    return result
}


function endConditionA(nodes) {
    let result = true;
    for (let i = 0; i < nodes.length; i++) {
        result = result && nodes[i].label === "ZZZ";
    }
    return result;
}

function endConditionB(nodes) {
    let result = true;
    for (let i = 0; i < nodes.length; i++) {
        result = result && nodes[i].label.endsWith("Z");
    }
    return result;
}

function runOneStep(problem, nodes, direction) {
    const result = [];
    nodes.forEach(node => {
        const nextLabel = node.next(direction);
        const nextNode = problem.nodes[nextLabel];
        result.push(nextNode);
    });
    return result;
}


