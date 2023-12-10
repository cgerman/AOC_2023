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
    let node = problem.nodes["AAA"];
    for (let i = 0; !endConditionA(node); i = (i + 1) % problem.directions.length) {
        const direction = problem.directions[i];
        node = runOneStepA(problem, node, direction);
        total++;
    }
    return total;
}

// Esto funciona, pero no acaba en un tiempo razonable
function solveB_bruteForce(list) {
    let total = 0;
    const problem = parseProblem(list, "B");
    let nodes = problem.startingPoints;
    for (let i = 0; !endConditionB(nodes); i = (i + 1) % problem.directions.length) {
        const direction = problem.directions[i];
        nodes = runOneStepB(problem, nodes, direction);
        total++;
    }
    return total;
}


function solveB(list) {
    // El problema B hay que tratarlo de manera radicalmente diferente
    // del problema A, porque de lo contrario, el tiempo que se tarda en resolverlo
    // es enorme.
    // Para resolver el problema B, hay que "jugar" con el input y darse cuenta que:
    // Hay 6 nodos "iniciales", donde empieza la iteración (DVA, MPA, TDA, AAA, FJA y XPA)
    // También hay 6 nodos "finales" (DGZ, MVZ, CJZ, MSZ, ZZZ, y QFZ).
    // Iterar los 6 nodos a la vez (como pide en enunciado) hasta que las 6 iteraciones
    // (A LA VEZ) lleguen a un nodo final es un problema de fuerza bruta inabarcable.
    // Lo que he hecho aquí, como preparación, es iterar cada nodo "inicial" por separado
    // y de manera indefinida, intentando buscar algunos patrones, y esto es lo que he averiguado:
    // Una iteración que empiece por DVA, recorre sólo 159 nodos distintos (de los 793 nodos del 
    // problema), y el recorrido alcanza el nodo "final" MSZ tras 23147 pasos, tras lo cual
    // vuelve a empezar el mismo ciclo de iteraciones, y así indefinidamente.
    // Empezando por MPA, se recorren sólo 135 nodos distintos, y se alcanza el nodo final DGZ
    // tras 19631 iteraciones, tras lo cual el ciclo vuelve a empezar.
    // Lo mismo ocurre con el resto:
    //
    // INICIAL  NODOS_DISTINTOS FINAL   PERIODO
    // DVA      159             MSZ     23147
    // MPA      135             DGZ     19631
    // TDA      87              MVZ     12599
    // AAA      147             ZZZ     21389
    // FJA      123             CJZ     17873
    // XPA      143             QFZ     20803
    //
    // Gracias a este comportamiento cíclico del problema podemos saber que si, tal como pide el 
    // enunciado, la iteración empieza desde los 6 nodos a la vez, y se detiene cuando los 6 recorridos
    // *a la vez* alcanzan un nodo final, ésto sólo pasará cuando transcurra un número de pasos igual 
    // al mínimo común múltiplo de los 6 periodos (un número gigante: 21.083.806.112.641). 

    const problem = parseProblem(list, "B");

    // Primero calculamos los 6 periodos por separado
    const periodos = [];
    problem.startingPoints.forEach(startingNode => {
        const periodo = calcularPeriodo(problem, startingNode);
        periodos.push(periodo);
    });

    // Ahora calculamos el mínimo comun múltiplo de los periodos
    let total = mcm(periodos);
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
            visited: false,
            lastIterationVisited: 0,
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
    return result;
}


function endConditionA(node) {    
    return node.label === "ZZZ";
}

function endConditionB(nodes) {
    let result = true;
    for (let i = 0; i < nodes.length; i++) {
        result = result && nodes[i].label.endsWith("Z");
    }
    return result;
}

function runOneStepA(problem, node, direction) {
    const nextLabel = node.next(direction);
    const nextNode = problem.nodes[nextLabel];
    return nextNode;
}

function runOneStepB(problem, nodes, direction) {
    const result = [];
    nodes.forEach(node => {
        const nextLabel = node.next(direction);
        const nextNode = problem.nodes[nextLabel];
        result.push(nextNode);
    });
    return result;
}

function calcularPeriodo (problem, startingNode) {
    let x = 0;
    let nodes = [startingNode];
    for (let i = 0; !endConditionB(nodes); i = (i + 1) % problem.directions.length) {
        const direction = problem.directions[i];
        nodes = runOneStepB(problem, nodes, direction);        
        x++;
    }
    return x;
}

function mcd2(a, b) {
    // Máximo comun divisor de 2 enteros
    if (!b) return b === 0 ? a : NaN;
    return mcd2(b, a % b);
}
function mcd(array) {
    // Máximo cimun divisor de un array de enteros
    var n = 0;
    for (var i = 0; i < array.length; ++i)
        n = mcd2(array[i], n);
    return n;
}
function mcm2(a, b) {
    // mínimo comun múltiplo de 2 enteros
    return a * b / mcd2(a, b);
}
function mcm(array) {
    // Mínimo común múltiplo de una lista de enteros
    var n = 1;
    for (var i = 0; i < array.length; ++i)
        n = mcm2(array[i], n);
    return n;
}