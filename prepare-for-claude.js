const fs = require('fs').promises;
const path = require('path');

// Whitelist of folders to include
const INCLUDED_FOLDERS = new Set([
    'app',
    'components',
    'features',
    'hooks',
    'lib',
    'models',
    'scripts',
    'services',
    'styles',
    'utils'
]);

// Whitelist of root-level files to include
const INCLUDED_ROOT_FILES = new Set([
    '.dockerignore',
    '.editorconfig',
    '.eslintrc.json',
    '.gitattributes',
    '.gitignore',
    'Dockerfile',
    'README.md',
    'components.json',
    'contentlayer.config.js',
    'instrumentation-client.js',
    'middleware.js',
    'next-sitemap.config.js',
    'next.config.mjs',
    'nixpacks.toml',
    'package.json',
    'postcss.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'vercel.json'
]);

// Function to check if a file is a media or binary file
function isMediaOrBinaryFile(filename) {
    const mediaExtensions = [
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'svg',
        // Videos
        'mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v',
        // Audio
        'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac',
        // Other media/binary
        'pdf', 'psd', 'ai', 'eps',
        // Binary files
        'zip', 'tar', 'gz', 'rar', '7z',
        'exe', 'dll', 'so', 'dylib',
        'woff', 'woff2', 'ttf', 'otf', 'eot',
        // Lock files
        'lock'
    ];
    const ext = path.extname(filename).toLowerCase().slice(1);
    
    // Also check for lock files by name
    if (filename === 'yarn.lock' || 
        filename === 'package-lock.json' || 
        filename === 'pnpm-lock.yaml' ||
        filename === 'bun.lockb') {
        return true;
    }
    
    return mediaExtensions.includes(ext);
}

// Function to check if path should be ignored based on custom patterns
function shouldIgnoreCustomPath(relativePath, filename = '') {
    const customIgnorePatterns = [
        // Ignore page_components/Cards/Tutorial/ directory
        'page_components/Cards/Tutorial',
        'page_components\\Cards\\Tutorial', // Windows path separator
        
        // Ignore files ending with _old
        '.*_old\\.',
        '.*_old$'
    ];
    
    for (const pattern of customIgnorePatterns) {
        const regex = new RegExp(pattern);
        if (regex.test(relativePath) || regex.test(filename)) {
            return true;
        }
    }
    
    // Additional check for _old files by filename
    if (filename && (filename.includes('_old.') || filename.endsWith('_old'))) {
        return true;
    }
    
    return false;
}

// Check if a file should be included
function shouldIncludeFile(filename, relativePath, isRootLevel = false) {
    // Always ignore the output file
    if (filename === 'claude-input.md') {
        return false;
    }
    
    // Ignore media and binary files
    if (isMediaOrBinaryFile(filename)) {
        return false;
    }
    
    // Ignore custom patterns
    if (shouldIgnoreCustomPath(relativePath, filename)) {
        return false;
    }
    
    // If it's a root level file, check the whitelist
    if (isRootLevel) {
        return INCLUDED_ROOT_FILES.has(filename);
    }
    
    // For non-root files, include if parent folder is whitelisted
    return true;
}

// Check if a folder should be included
function shouldIncludeFolder(folderName, relativePath, isRootLevel = false) {
    // Ignore custom patterns
    if (shouldIgnoreCustomPath(relativePath, folderName)) {
        return false;
    }
    
    // If it's a root level folder, check the whitelist
    if (isRootLevel) {
        return INCLUDED_FOLDERS.has(folderName);
    }
    
    // For non-root folders (subfolders), include them if we're already in a whitelisted folder
    return true;
}

// Minification functions
function minifyContent(content, extension) {
    switch(extension.toLowerCase()) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return minifyJS(content);
        case 'css':
            return minifyCSS(content);
        case 'html':
            return minifyHTML(content);
        default:
            return content;
    }
}

function minifyJS(code) {
    return code
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s*{\s*/g, '{') // Remove spaces around braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*=\s*/g, '=')
        .replace(/^\s+|\s+$/g, ''); // Trim start and end
}

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/^\s+|\s+$/g, ''); // Trim start and end
}

function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/>\s+</g, '><') // Remove spaces between tags
        .replace(/^\s+|\s+$/g, ''); // Trim start and end
}

// Function to check if a path exists and determine if it's a file or directory
async function getPathType(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.isDirectory() ? 'directory' : 'file';
    } catch (error) {
        return null; // Path doesn't exist
    }
}

// Function to process a single file
async function processFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const extension = path.extname(filePath).slice(1);
        const minifiedContent = minifyContent(content, extension);
        return {
            path: filePath,
            content: minifiedContent,
            extension: extension
        };
    } catch (error) {
        console.warn(`Warning: Could not read file ${filePath}:`, error.message);
        return null;
    }
}

// Function to process a directory and return all files
async function processDirectory(dirPath, basePath = '', isRootLevel = false) {
    let files = [];
    
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            const relativePath = path.join(basePath, item.name);
            
            if (item.isDirectory()) {
                if (shouldIncludeFolder(item.name, relativePath, isRootLevel)) {
                    const subFiles = await processDirectory(fullPath, relativePath, false);
                    files = files.concat(subFiles);
                }
            } else {
                if (shouldIncludeFile(item.name, relativePath, isRootLevel)) {
                    const fileData = await processFile(fullPath);
                    if (fileData) {
                        files.push({
                            ...fileData,
                            path: relativePath || item.name
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}:`, error.message);
    }
    
    return files;
}

// Function to create file structure tree
async function getFileStructure(dirPath, prefix = '', basePath = '', isRootLevel = false) {
    let output = '';
    
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const relativePath = path.join(basePath, item.name);
            
            if (item.isDirectory() && !shouldIncludeFolder(item.name, relativePath, isRootLevel)) {
                continue;
            }
            if (!item.isDirectory() && !shouldIncludeFile(item.name, relativePath, isRootLevel)) {
                continue;
            }
            
            output += `${prefix}${item.isDirectory() ? '├── ' : '└── '}${item.name}\n`;
            if (item.isDirectory()) {
                output += await getFileStructure(
                    path.join(dirPath, item.name),
                    prefix + '│   ',
                    relativePath,
                    false
                );
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory structure for ${dirPath}:`, error.message);
    }
    
    return output;
}

// Function to read file list from a text file
async function readFileList(listPath) {
    try {
        const content = await fs.readFile(listPath, 'utf8');
        return content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Filter out empty lines and comments
    } catch (error) {
        console.error(`Error reading file list from ${listPath}:`, error.message);
        return [];
    }
}

// Main processing function
async function processMultipleFiles(fileList) {
    let output = '';
    let allFiles = [];
    let directories = [];
    
    // First, collect all files and directories
    for (const itemPath of fileList) {
        const pathType = await getPathType(itemPath);
        
        if (pathType === 'file') {
            const fileData = await processFile(itemPath);
            if (fileData) {
                allFiles.push(fileData);
            }
        } else if (pathType === 'directory') {
            directories.push(itemPath);
            const dirFiles = await processDirectory(itemPath, '', true);
            allFiles = allFiles.concat(dirFiles);
        } else {
            console.warn(`Warning: Path does not exist: ${itemPath}`);
        }
    }
    
    // Create file structure section
    if (directories.length > 0) {
        output += 'File Structure:\n';
        for (const dirPath of directories) {
            output += `\n${dirPath}/\n\`\`\`\n`;
            const structure = await getFileStructure(dirPath, '', '', true);
            output += structure + '\n\`\`\`\n';
        }
        output += '\n';
    }
    
    // Create file contents section
    if (allFiles.length > 0) {
        output += 'File Contents:\n\n';
        
        // Sort files by path for consistent output
        allFiles.sort((a, b) => a.path.localeCompare(b.path));
        
        for (const file of allFiles) {
            output += `File: ${file.path}\n\`\`\`${file.extension}\n${file.content}\n\`\`\`\n\n`;
        }
    }
    
    return output;
}

// Usage
async function main() {
    try {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.log('Usage:');
            console.log('  node script.js <file1> <file2> <dir1> ...');
            console.log('  node script.js --list <path-to-file-list.txt>');
            console.log('  node script.js .  (to process entire project with whitelist)');
            console.log('');
            console.log('Examples:');
            console.log('  node script.js .');
            console.log('  node script.js --list files-to-process.txt');
            console.log('');
            console.log('Whitelist approach - Only includes:');
            console.log('  Folders:', Array.from(INCLUDED_FOLDERS).join(', '));
            console.log('  Root files:', Array.from(INCLUDED_ROOT_FILES).slice(0, 5).join(', '), '...');
            console.log('');
            console.log('Always excludes:');
            console.log('  - Media files (images, videos, audio, fonts, etc.)');
            console.log('  - Binary files');
            console.log('  - Lock files (yarn.lock, package-lock.json, etc.)');
            console.log('  - claude-input.md (output file)');
            console.log('  - page_components/Cards/Tutorial/');
            console.log('  - *_old files');
            return;
        }
        
        let fileList = [];
        
        if (args[0] === '--list' && args[1]) {
            // Read file list from a text file
            fileList = await readFileList(args[1]);
        } else {
            // Use command line arguments as file list
            fileList = args;
        }
        
        if (fileList.length === 0) {
            console.log('No files to process.');
            return;
        }
        
        console.log('Processing with whitelist approach...');
        console.log('Items to process:', fileList);
        
        const output = await processMultipleFiles(fileList);
        
        const outputFile = 'claude-input.md';
        await fs.writeFile(outputFile, output);
        console.log(`\nSuccessfully created ${outputFile}`);
        console.log(`Output file size: ${(output.length / 1024 / 1024).toFixed(2)} MB`);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

// command to call this script
// node prepare-for-claude .
// or
// node prepare-for-claude --list prepare-for-claude-list.txt
