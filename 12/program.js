import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";
import chalk from "chalk";


export async function program_12_A0() {
    const list = await readInput(path.join(__dirName, "12/input_A0.txt"));
    return solveA(list);
}

export async function program_12_A() {
    const list = await readInput(path.join(__dirName, "12/input_A.txt"));
    return solveA(list);
}

export async function program_12_B0() {
    const list = await readInput(path.join(__dirName, "12/input_B0.txt"));
    return solveB(list);
}

export async function program_12_B() {
    const list = await readInput(path.join(__dirName, "12/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let total = 0;
    const problem = parseProblemA(list);

    problem.rows.forEach(row => {
        const nArrangements = countArrangements(row.originalTemplate, row.template, row.regexp);
        total += nArrangements;
    });

    return total;
}

function solveB(list) {
    let total = 0;
    const problem = parseProblemB(list);

    problem.rows.forEach(row => {
        console.log(row.originalTemplate, chalk.yellow(" -- "), row.regexp)
        const nArrangements = countArrangements(row.originalTemplate, row.template, row.regexp);
        total += nArrangements;
    });

    return total;
}

function solveC(list) {
    let total = 0;
    const problem = parseProblemA(list);
    problem.rows.forEach(row => {
        const nArrangements = exploreRow(row.originalTemplate, row.regexp);
        total += nArrangements;
    });

    return total;
}

function parseProblemA(list) {
    const problem = {
        rows: []
    };
    list.forEach(line => {
        const parts = line.split(" ");
        problem.rows.push({
            originalTemplate: parts[0],
            template: Array.from(parts[0]),
            regexp: parts[1].split(",").map(c => 1 * c)
        });
    });
    return problem;
}

function parseProblemB(list) {
    const problem = {
        rows: []
    };
    list.forEach(line => {
        const parts = line.split(" ");
        problem.rows.push({
            originalTemplate: unfoldTemplate(parts[0]),
            template: Array.from(unfoldTemplate(parts[0])),
            regexp: unfoldRegexp(parts[1]).split(",").map(c => 1 * c)
        });
    });
    return problem;
}

function unfoldTemplate(str) {
    let result = str;
    result += "?" + str;
    result += "?" + str;
    result += "?" + str;
    result += "?" + str;
    return result;
}

function unfoldRegexp(str) {
    let result = str;
    result += "," + str;
    result += "," + str;
    result += "," + str;
    result += "," + str;
    return result;
}

const memory = {};

function countArrangements(originalTemplate, template, regexp) {
    // Miramos en la memoria a ver si ya hemos calculado estas template y regex
    const strTemplate = template.reduce((str, c) => str + c, "");
    const key = strTemplate+" ["+regexp+"]";
    const n = memory[key];
    if (n != undefined) {
        console.log("memorized: ", strTemplate, " -- ", n, "arrangements");
        return n;
    }

    // Acortamos el caso de que regexp sea [1]. En ese caso, si template tiene
    // - exactamente un broken ==> arrangements = 1 (todos los ? pasan a .)
    // - > 1 broken ==> 0 arrangements
    // - 0 brokens ==> hay tantos arrangements como ?
    if (regexp.length == 1 && regexp[0] === 1) {
        let xBroken = 0, xQuestion = 0;
        for (let i = 0; i < template.length; i++) {
            if (template[i] === "#") xBroken++;
            if (template[i] === "?") {
                xQuestion++;
                //template[i] = ".";
            }
        }
        if (xBroken > 1) return templateSatisfiesRegexp(originalTemplate, template, regexp, 0);
        if (xBroken === 1) return templateSatisfiesRegexp(originalTemplate, template, regexp, 1);
        return templateSatisfiesRegexp(originalTemplate, template, regexp, xQuestion);
    }

    let total = 0;
    for (let i = 0; i < template.length;) {
        if (template[i] === ".") {
            i++; // saltamos los puntos            
        } else if (template[i] === "#") {
            const nBroken = regexp[0];
            if (i + nBroken > template.length) {
                return templateSatisfiesRegexp(originalTemplate, template, regexp, 0); // template no satisface regexp
            }
            for (let j = 0; j < nBroken; j++) {
                if (template[i + j] === ".") {
                    return templateSatisfiesRegexp(originalTemplate, template, regexp, 0); // template no satisface regexp
                }
            }

            // sustituimos en template "?" por "#" hasta que el número de "#" sea igual a nBroken
            let broken = new Array(nBroken).fill("#");
            //template.splice(i, nBroken, ...broken);
            i += nBroken;
            regexp = regexp.slice(1);

            // Tras "consumir" el numero de broken springs, si no estamos al final, viene por lo menos un "."
            if (regexp.length > 0) {
                if (template[i] === "#") {
                    return 0; // template no satisface regexp
                }
                //template[i] = ".";
                i++;
            } else {
                // Y si estamos al final, entonces todo tienen que ser . o ? (que pasan a .)
                for (let j = i; j < template.length; j++) {
                    if (template[j] === "#") {
                        return templateSatisfiesRegexp(originalTemplate, template, regexp, 0);
                    } else {
                        template[j] = ".";
                    }
                }
                i = template.length;
            }
        } else { // template[i] === "?"
            // sustituimos el ? por un # y contamos los arrangements que quedan
            let template2 = ["#"].concat(template.slice(i + 1));
            total += countArrangements(originalTemplate, template2, regexp);
            // sustituimos el ? por un . y contamos los arrangements que quedan
            template2 = ["."].concat(template.slice(i + 1));
            total += countArrangements(originalTemplate, template2, regexp);
            return templateSatisfiesRegexp(originalTemplate, template, regexp, total);
        }
    }

    if (regexp.length > 0) {
        // Si hemos llegado al final de template y todavía no hemos consumido todos
        // los grupos de broken de regexp, template no satisface regexp
        return templateSatisfiesRegexp(originalTemplate, template, regexp, 0);
    }
    total++;

    return templateSatisfiesRegexp(originalTemplate, template, regexp, total);
}

function templateSatisfiesRegexp(originalTemplate, template, regexp, n) {
    const strTemplate = template.reduce((str, c) => str + c, "");
    const key = strTemplate+" ["+regexp+"]";
    memory[key] = n;
    if (originalTemplate === strTemplate) {
        console.log(strTemplate, " ==> ", n, "arrangements");
    }
    return n;
}

function exploreRow(template, regexp) {
    let total = 0;
    const re = buildRegexp(regexp);
    const nQuestions = countQuestions(template);
    const iterador = iteradorNumeros(Math.pow(2, nQuestions));
    let next = iterador.next();
    while (!next.done) {
        const str = instantiate(template, binaryCode(next.value, nQuestions));
        if (re.test(str)) {
            //console.log(str)
            total++;
        }
        next = iterador.next();
    }
    console.log(template, " ==> ", total, "arrangements")
    return total;
}

function countQuestions(template) {
    let result = 0;
    for (let i = 0; i < template.length; i++) {
        if (template[i] === "?") result++;
    }
    return result;
}

function* iteradorNumeros(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

function binaryCode(num, padding) {
    let binary = num.toString(2);
    return binary.padStart(padding, '0');
}

function instantiate(template, binary) {
    let result = "";
    for (let i = 0, j = 0; i < template.length; i++) {
        if (template[i] === "?") {
            const n = binary[j++];
            result += (n === "0" ? "#" : ".");
        } else {
            result += template[i];
        }
    }
    return result;
}

function buildRegexp(brokenArray) {
    let str = "^\\.*";
    brokenArray.forEach(nBroken => {
        str += "#{" + nBroken + "}";
        str += "\\.+";
    });
    str = str.substring(0, str.length - 1) + "*$";
    return new RegExp(str);
}
