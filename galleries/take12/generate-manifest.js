// Helper: regenerates manifest.json and manifest.js from whatever is in /images.
// Run with: node generate-manifest.js
// (Requires Node.js installed on your computer.)

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const manifestPath = path.join(__dirname, 'manifest.json');
const manifestJsPath = path.join(__dirname, 'manifest.js');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

if (!fs.existsSync(imagesDir)) {
  console.error('No "images" folder found next to this script. Create one and add photos to it.');
  process.exit(1);
}

const files = fs
  .readdirSync(imagesDir)
  .filter((f) => allowedExtensions.includes(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const json = JSON.stringify(files, null, 2);
fs.writeFileSync(manifestPath, json + '\n');
fs.writeFileSync(manifestJsPath, 'window.GALLERY_MANIFEST = ' + json + ';\n');
console.log('manifest.json and manifest.js updated with ' + files.length + ' image(s):');
files.forEach((f) => console.log('  - ' + f));
