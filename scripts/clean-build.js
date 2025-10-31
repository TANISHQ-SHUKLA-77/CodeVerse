/**
 * Script to clean Next.js build artifacts
 * Run with: node scripts/clean-build.js
 * Or: npm run clean
 */

const fs = require('fs');
const path = require('path');

const directoriesToClean = [
  '.next',
  'node_modules/.cache',
];

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✓ Cleaned: ${dirPath}`);
      return true;
    } catch (error) {
      console.error(`✗ Error cleaning ${dirPath}:`, error.message);
      return false;
    }
  } else {
    console.log(`⊘ Not found: ${dirPath}`);
    return true;
  }
}

console.log('🧹 Cleaning Next.js build artifacts...\n');

let allCleaned = true;
for (const dir of directoriesToClean) {
  const fullPath = path.join(process.cwd(), dir);
  if (!removeDirectory(fullPath)) {
    allCleaned = false;
  }
}

console.log('\n✅ Clean complete!');
console.log('💡 Now run: npm run dev');

process.exit(allCleaned ? 0 : 1);

