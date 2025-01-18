const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function out(...str){
    process.stdout.write(str.join(''));
}

async function copyDir() {
    // Create the 'files-copy' folder if it does not exist
    try {
        await fs.promises.mkdir(targetDir, { recursive: true });
    } catch (err) {
        out('Error creating target directory:', err);
        return;
    }

    // Read the contents of the 'files' folder
    try {
        const sourceFiles = await fs.promises.readdir(sourceDir, { withFileTypes: true });
        const targetFiles = await fs.promises.readdir(targetDir, { withFileTypes: true });

        // Copy files from 'files' to 'files-copy'
        for (const file of sourceFiles) {
            const sourceFilePath = path.join(sourceDir, file.name);
            const targetFilePath = path.join(targetDir, file.name);

            if (file.isFile()) {
                // Copy file
                await fs.promises.copyFile(sourceFilePath, targetFilePath);
            }
        }
        // remove files from 'files-copy',  which are missing in 'files'
        for (const file of targetFiles) {
            if (!sourceFiles.some(sourceFile => sourceFile.name === file.name)) {
                const targetFilePath = path.join(targetDir, file.name);
                await fs.promises.unlink(targetFilePath);
            }
        }
    } catch (err) {
        out('Error reading source directory:', err);
    }
}

// Execute the copyDir function
copyDir();
