const fs = require('fs');
const path = require('path');
const readline = require('readline');

function out(...str){ //aka console.log()
    process.stdout.write(str.join(''));
}

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a', encoding: 'utf-8' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

out('Please enter text to write to the file. Enter "exit" for the exit.\n');

const handleInput = (input) => {
    if (input.trim().toLowerCase() === 'exit') { // close app if input "exit"
        process.exit(0);
    } else {
        writableStream.write(`${input}\n`);
        out('The text has been written to the file. Please enter more text:\n');
}
};

rl.on('line', handleInput);

// close app if pressed (Ctrl + C)
process.on('exit', () => {
    out('\nGoodbye! Thank you for using the program.');
    rl.close();
    writableStream.end();
    process.exit();
});

writableStream.on('error', (err) => {
    out(`Error writing to file: ${err.message}\n`);
    process.exit(0);
});
