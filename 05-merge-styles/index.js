const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function out(...str){ //aka console.log()
    process.stdout.write(str.join(''));
}

// Function to merge CSS files
async function mergeStyles() {
    // Ensure the output directory exists
    try {
        await fs.promises.mkdir(outputDir, { recursive: true });
    } catch (err) {
        out('Error creating output directory:', err);
        return;
    }

    // Clear bundle.css if it exists
    try {
        await fs.promises.writeFile(outputFile, ''); // Clear the file
    } catch (err) {
        out('Error clearing output file:', err);
        return;
    }

    // Read the contents of the styles directory
    try {
        const files = await fs.promises.readdir(stylesDir);

        for (const file of files) {
            const filePath = path.join(stylesDir, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isFile() && path.extname(file) === '.css') { // Check if the file is a CSS file
                const cssContent = await fs.promises.readFile(filePath, 'utf-8');
                await fs.promises.appendFile(outputFile, cssContent + '\n'); // add content to bundle.css
            }
        }
    } catch (err) {
        out('Error reading styles directory:', err);
    }
}

// Execute the mergeStyles function
mergeStyles();
