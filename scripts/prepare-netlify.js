import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ensure functions directory exists
const functionsDir = path.join(rootDir, 'netlify', 'functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
  console.log('Created netlify/functions directory');
}

// Copy server files to netlify functions
const serverDir = path.join(rootDir, 'server');
const serverDestDir = path.join(functionsDir, 'server');

// Remove existing server files if they exist
if (fs.existsSync(serverDestDir)) {
  fs.rmSync(serverDestDir, { recursive: true, force: true });
  console.log('Removed existing server files in netlify/functions/server');
}

// Copy server files recursively
copyDirectory(serverDir, serverDestDir);
console.log('Copied server files to netlify/functions/server');

// Copy .env file to netlify/functions/.env if it exists
const envFile = path.join(rootDir, '.env');
const envDestFile = path.join(functionsDir, '.env');

if (fs.existsSync(envFile)) {
  fs.copyFileSync(envFile, envDestFile);
  console.log('Copied .env to netlify/functions/.env');
} else {
  console.warn('.env file not found. Make sure to set environment variables in Netlify dashboard.');
}

console.log('Build preparation for Netlify deployment completed successfully');

/**
 * Recursively copy a directory
 * @param {string} src Source directory
 * @param {string} dest Destination directory
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
} 