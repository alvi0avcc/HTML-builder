const fs = require('fs');
const path = require('path');

function out(...str){
    process.stdout.write(str.join(''));
}

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        out('Error reading the directory:', err);
        return;
    }

    files.forEach(file => { // Iterate each item in the directory
        if (file.isFile()) {
            const filePath = path.join(secretFolderPath, file.name);
            
            // obtain information about a file
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    out('Error getting file stats:', err);
                    return;
                }
                const fileName = path.parse(file.name).name;
                const fileExtension = path.extname(file.name).slice(1);
                const fileSize = (stats.size / 1024).toFixed(3); // Convert size to KB

                // Display the file information
                out(`${fileName} - ${fileExtension} - ${fileSize}kb\n`);
            });
        }
    });
});