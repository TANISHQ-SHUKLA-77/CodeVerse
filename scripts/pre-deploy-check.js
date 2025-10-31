/**
 * Pre-deployment check script
 * Run this before pushing to GitHub to ensure sensitive files are not tracked
 * 
 * Usage: node scripts/pre-deploy-check.js
 */

const fs = require('fs');
const path = require('path');

const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.devlopment',
  'temp.env',
  'repomix-output.xml',
  'package.json.backup',
];

const sensitivePatterns = [
  /\.env$/,
  /\.env\.local$/,
  /\.env\.development/,
  /temp\.env/,
  /repomix.*\.xml/,
  /\.backup$/,
];

console.log('🔍 Checking for sensitive files...\n');

let foundIssues = false;
const issues = [];

// Check for sensitive files
for (const file of sensitiveFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    issues.push(`⚠️  Found: ${file}`);
    foundIssues = true;
  }
}

// Check if files are in .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
let gitignoreContent = '';
if (fs.existsSync(gitignorePath)) {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
}

const missingFromGitignore = [];
for (const file of sensitiveFiles) {
  if (!gitignoreContent.includes(file)) {
    missingFromGitignore.push(file);
  }
}

if (missingFromGitignore.length > 0) {
  foundIssues = true;
  issues.push(`\n❌ These files are NOT in .gitignore:`);
  missingFromGitignore.forEach(file => {
    issues.push(`   - ${file}`);
  });
}

if (foundIssues) {
  console.log('❌ Issues found:\n');
  issues.forEach(issue => console.log(issue));
  console.log('\n📋 Recommendations:');
  console.log('1. Make sure all sensitive files are in .gitignore');
  console.log('2. If files are already tracked, remove them:');
  console.log('   git rm --cached <file>');
  console.log('3. Verify with: git status');
  process.exit(1);
} else {
  console.log('✅ No sensitive files found!');
  console.log('✅ All sensitive files are properly ignored');
  console.log('\n🚀 Ready to push to GitHub!');
  process.exit(0);
}

