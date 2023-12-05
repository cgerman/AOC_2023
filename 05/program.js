import path from "path";
import { __dirName, readInput, log } from "../utils/Utils.js";


export async function program_5_A0() {
    const list = await readInput(path.join(__dirName, "05/input_A0.txt"));
    return solveA(list);
}

export async function program_5_A() {
    const list = await readInput(path.join(__dirName, "05/input_A.txt"));
    return solveA(list);
}

export async function program_5_B0() {
    const list = await readInput(path.join(__dirName, "05/input_B0.txt"));
    return solveB(list);
}

export async function program_5_B() {
    const list = await readInput(path.join(__dirName, "05/input_B.txt"));
    return solveB(list);
}

function solveA(list) {
    let closestLocation = -1;
    const problem = parseProblem(list);
    problem.seeds.forEach(seed => {
        const soil = map(seed, problem.seedToSoil_Map);
        const fertilizer = map(soil, problem.soilToFertilizer_Map);
        const water = map(fertilizer, problem.fertilizerToWater_Map);
        const light = map(water, problem.waterToLight_Map);
        const temperature = map(light, problem.lightToTemperature_Map);
        const humidity = map(temperature, problem.temperatureToHumidity_Map);
        const location = map(humidity, problem.humidityToLocation_Map);
        if (closestLocation === -1 || location < closestLocation) {
            closestLocation = location;
        }
    });
    return closestLocation;
}

function solveB(list) {
    let closestLocation = -1;
    let totalSeeds = 0;
    const problem = parseProblem(list);
    problem.seedRanges.forEach(seedRange => {
        totalSeeds += seedRange.length;
    });
    console.log ("total seeds: ", new Intl.NumberFormat('es-ES').format(totalSeeds));
    //return closestLocation;
    problem.seedRanges.forEach(seedRange => {
        console.log("seedRange")
        let seed = seedRange.firstSeed();
        while (seed) {
            const soil = map(seed, problem.seedToSoil_Map);
            const fertilizer = map(soil, problem.soilToFertilizer_Map);
            const water = map(fertilizer, problem.fertilizerToWater_Map);
            const light = map(water, problem.waterToLight_Map);
            const temperature = map(light, problem.lightToTemperature_Map);
            const humidity = map(temperature, problem.temperatureToHumidity_Map);
            const location = map(humidity, problem.humidityToLocation_Map);
            /*
            console.log("seed:", seed, "soil:", soil, "fertilizer:", fertilizer,
                "water:", water, "light:", light, "temperature:", temperature,
                "humidity:", humidity, "location:", location); 
            */
            if (closestLocation === -1 || location < closestLocation) {
                closestLocation = location;
            }
            seed = seedRange.nextSeed();
        }
    });
    return closestLocation;
}

function parseProblem(list) {
    const problem = {
        seeds: [],
        seedRanges: [], // Para la segunda parte del problema
        seedToSoil_Map: [],
        soilToFertilizer_Map: [],
        fertilizerToWater_Map: [],
        waterToLight_Map: [],
        lightToTemperature_Map: [],
        temperatureToHumidity_Map: [],
        humidityToLocation_Map: []
    }
    const lines = list.toArray();

    let i = 0
    // La primera linea contiene las seeds
    const seedsLine = lines[i++].split(':');
    problem.seeds = seedsLine[1].split(' ').filter(e => e.length > 0);
    for (let j = 0; j < problem.seeds.length; j += 2) {
        const seedRange = {
            start: 1 * problem.seeds[j],
            length: 1 * problem.seeds[j + 1],
            firstSeed: function () {
                this._lastReturnedSeed = this.start;
                return this.start;
            },
            nextSeed: function () {
                if (this._lastReturnedSeed + 1 === this.start + this.length) {
                    return null;
                }
                this._lastReturnedSeed++;
                return this._lastReturnedSeed;
            }
        };
        problem.seedRanges.push(seedRange);
    }
    i++; // linea en blanco
    i++; // seed-to-soil map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.seedToSoil_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // soil-to-fertilizer map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.soilToFertilizer_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // fertilizer-to-water map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.fertilizerToWater_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // water-to-light map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.waterToLight_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // light-to-temperature map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.lightToTemperature_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // temperature-to-humidity map
    while (lines[i] != "") {
        const instruction = parseTransformerInstruction(lines[i], problem.temperatureToHumidity_Map);
        i++;
    }

    i++; // linea en blanco
    i++; // humidity-to-location map
    while (lines[i] != "" && i < lines.length) {
        const instruction = parseTransformerInstruction(lines[i], problem.humidityToLocation_Map);
        i++;
    }
    return problem;
}

function parseTransformerInstruction(line, transformerArray) {
    const transformInstructions = line.split(' ');
    const instruction = {
        destinationRangeStart: 1 * transformInstructions[0],
        sourceRangeStart: 1 * transformInstructions[1],
        rangeLength: 1 * transformInstructions[2],
        transform: function (src) {
            if (src >= this.sourceRangeStart && src < this.sourceRangeStart + this.rangeLength) {
                const offset = src - this.sourceRangeStart;
                return this.destinationRangeStart + offset;
            }
            return src;
        }
    };
    transformerArray.push(instruction);
    return instruction;
}

function map(src, transformers) {
    let destination = src;
    transformers.forEach(transformer => {
        const dst = transformer.transform(src);
        if (dst != src) destination = dst;
    });
    return destination;
}

