const fsPromises = require('fs').promises;
const path = require('path');

// paths
const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

function out(...str){ //aka console.log()
    process.stdout.write(str.join(''));
}

// create "project-dist" folder
async function createProjectDist() {
    await fsPromises.mkdir(projectDistPath, { recursive: true });
}

// replace template tags with component content
async function buildHtml() {
    let template = await fsPromises.readFile(templatePath, 'utf-8');
    const componentFiles = await fsPromises.readdir(componentsPath);

    for (const file of componentFiles) {
        if (path.extname(file) === '.html') {
            const componentName = path.basename(file, '.html');
            const componentContent = await fsPromises.readFile(path.join(componentsPath, file), 'utf-8');
            const tag = `{{${componentName}}}`;
            template = template.replace(new RegExp(tag, 'g'), componentContent);
        }
    }

    await fsPromises.writeFile(path.join(projectDistPath, 'index.html'), template);
}

// Function for merge styles
async function compileStyles() {
    const styleFiles = await fsPromises.readdir(stylesPath);
    const styles = [];

    for (const file of styleFiles) {
        if (path.extname(file) === '.css') {
            const styleContent = await fsPromises.readFile(path.join(stylesPath, file), 'utf-8');
            styles.push(styleContent);
        }
    }

    await fsPromises.writeFile(path.join(projectDistPath, 'style.css'), styles.join('\n'));
}

// Function to copy assets
async function copyAssets(src, dest) {
    await fsPromises.mkdir(dest, { recursive: true });
    
    const files = await fsPromises.readdir(src);

    for (const file of files) {
        const srcFilePath = path.join(src, file);
        const destFilePath = path.join(dest, file);
        const stats = await fsPromises.stat(srcFilePath);

        if (stats.isDirectory()) {
            await copyAssets(srcFilePath, destFilePath);
        } else {
            await fsPromises.copyFile(srcFilePath, destFilePath);
        }
    }
}

// Main function to execute all tasks
async function buildPage() {
    await createProjectDist();
    await buildHtml();
    await compileStyles();
    await copyAssets(assetsPath, path.join(projectDistPath, 'assets'));
    out('Project built successfully!');
}

// Start build
buildPage();
