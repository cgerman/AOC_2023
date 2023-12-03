import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import LinkedList from 'mnemonist/linked-list.js';

export const __dirName = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function readInput(inputFile) {
    const list = new LinkedList();
    try {
        const fileStream = fs.createReadStream(inputFile);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            list.push(line);
          }
    } catch (error) {
        console.error(`Error al procesar el archivo: ${error.message}`);
    }

    return list;
} 