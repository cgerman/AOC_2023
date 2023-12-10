import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";


export async function program_7_A0() {
    const list = await readInput(path.join(__dirName, "07/input_A0.txt"));
    return solveA(list);
}

export async function program_7_A() {
    const list = await readInput(path.join(__dirName, "07/input_A.txt"));
    return solveA(list);
}

export async function program_7_B0() {
    const list = await readInput(path.join(__dirName, "07/input_B0.txt"));
    return solveB(list);
}

export async function program_7_B() {
    const list = await readInput(path.join(__dirName, "07/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblem(list, "A");
    problem.sort(handComparator);
    for (let rank = 1; rank <= problem.length; rank++) {
        const hand = problem[rank - 1];
        total += rank * hand.bid;
    }
    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblem(list, "B");

    for (let i = 0; i < problem.length; i++) {
        const hand = problem[i];

        // Cambiamos el hand.type en funcion de los Jokers
        const numJokers = hand.numCards["J"];
        if (!numJokers) continue; // Si no hay comodines, no cambia el hand.type

        const sortedRepetitions = hand.sortedRepetitions;
        if (hand.numericType === 7) { // repoker
            // No cambia el hand.type
        } else if (hand.numericType === 6) { // poker           
            // Hay 4 "J" y otra carta, o bien 4 cartas iguakes y una "J". hand.type pasa a ser repoker
            hand.type = "Five of a kind";
            hand.numericType = 7;
        } else if (hand.numericType === 5) { // full           
            // hay 3 "J" y dos cartas iguales o 3 cartas iguales y 2 "J". hand.type pasa ser repoker
            hand.type = "Five of a kind";
            hand.numericType = 7;
        } else if (hand.numericType === 4) { // trio
            if (numJokers === 1) {
                // Hay 3 cartas iguales y una "J". hand.type pasa a ser poker
                hand.type = "Four of a kind";
                hand.numericType = 6;
            } else {
                // numJokers no puede ser 2, porque la mano sería un full, pero puede ser 3 (un trio de "J")
                // en cuyo caso la mano pasa a ser un poker
                hand.type = "Four of a kind";
                hand.numericType = 6;
            }
        } else if (hand.numericType === 3) { // doble pareja
            if (numJokers === 1) {
                // hand.type pasa a ser un full
                hand.type = "Full house";
                hand.numericType = 5;
            } else {
                // hand.type pasa a ser un poker
                hand.type = "Four of a kind";
                hand.numericType = 6;
            }
        } else if (hand.numericType === 2) { // pareja
            if (numJokers === 1) {
                // hand.type pasa a ser un trio
                hand.type = "Three of a kind";
                hand.numericType = 4;
            } else {
                // Si pa pareja es de "J", entonces, hand.type pasa a ser un trío
                hand.type = "Three of a kind";
                hand.numericType = 4;
            }
        } else {  // jardin variado
            // Solo puede haber una "J" handType pasa a ser una pareja
            hand.type = "One pair";
            hand.numericType = 2;
        }

    }
    problem.sort(handComparator);
    for (let rank = 1; rank <= problem.length; rank++) {
        const hand = problem[rank - 1];
        total += rank * hand.bid;
    }
    return total;
}

function parseProblem(list, step) {
    const problem = [];
    list.forEach(line => {
        const parts = line.split(" ");
        const hand = {
            strCards: parts[0],
            cards: parseCards(parts[0], step),
            bid: 1 * parts[1],
            toString: function () {
                return this.strCards + " - " + this.type + "(" + this.numericType + ")"
            }
        };
        problem.push(hand);
        hand.numCards = {};
        for (let char of parts[0]) {
            hand.numCards[char] = (hand.numCards[char] ?? 0) + 1;
        }
        const repetitions = Object.values(hand.numCards).sort((a, b) => b - a);
        if (repetitions[0] === 5) { // repoker
            hand.type = "Five of a kind";
            hand.numericType = 7;
        } else if (repetitions[0] === 4) { // poker
            hand.type = "Four of a kind";
            hand.numericType = 6;
        } else if (repetitions[0] === 3 && repetitions[1] === 2) { // full
            hand.type = "Full house";
            hand.numericType = 5;
        } else if (repetitions[0] === 3) { // trio
            hand.type = "Three of a kind";
            hand.numericType = 4;
        } else if (repetitions[0] === 2 && repetitions[1] === 2) { // doble pareja
            hand.type = "Two pair";
            hand.numericType = 3;
        } else if (repetitions[0] === 2) { // pareja
            hand.type = "One pair";
            hand.numericType = 2;
        } else { // jardin variado
            hand.type = "High card";
            hand.numericType = 1;
        }
        hand.sortedRepetitions = repetitions;
    });

    return problem;
}

function parseCards(strCards, step) {
    const result = [];
    for (let c of strCards) {
        const card = {
            strength: (step === "A" ? getCardStrengthA(c) : getCardStrengthB(c)),
            label: c
        };
        result.push(card);
    }
    return result;
}

function handComparator(a, b) {
    if (a.numericType != b.numericType) {
        return a.numericType - b.numericType;
    }
    if (a.cards[0].strength != b.cards[0].strength) {
        return a.cards[0].strength - b.cards[0].strength;
    }
    if (a.cards[1].strength != b.cards[1].strength) {
        return a.cards[1].strength - b.cards[1].strength;
    }
    if (a.cards[2].strength != b.cards[2].strength) {
        return a.cards[2].strength - b.cards[2].strength;
    }
    if (a.cards[3].strength != b.cards[3].strength) {
        return a.cards[3].strength - b.cards[3].strength;
    }
    return a.cards[4].strength - b.cards[4].strength;
}

const availableCards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const availableCardStrengthsA = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

function getCardStrengthA(c) {
    const i = availableCards.indexOf(c);
    return availableCardStrengthsA[i];
}

const availableCardStrengthsB = [13, 12, 11, 1, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function getCardStrengthB(c) {
    const i = availableCards.indexOf(c);
    return availableCardStrengthsB[i];
}

