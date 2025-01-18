const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

function out(...str){
    process.stdout.write(str.join(''));
}

let readAll = "";

const readableStream = fs.createReadStream(filePath, 'utf8');

readableStream.on("data", (readChunk) => {
    readAll += readChunk;
});

readableStream.on("end", () => out(readAll));

readableStream.on("error", (error) => out("Error", error.message));
