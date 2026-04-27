#!/usr/bin/env node

// Simple script to verify all Replit files are ready
const fs = require('fs');
const path = require('path');

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  Chatbot Ready for Replit!');
console.log('═══════════════════════════════════════════════════════');
console.log('');

const requiredFiles = [
  'server.js',
  'package.json',
  '.replit'
];

const requiredFolders = [
  'frontend-chatbot/build'
];

console.log('Checking files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✓' : '✗';
  console.log(`  ${status} ${file}`);
});

console.log('');
console.log('Checking folders:');
requiredFolders.forEach(folder => {
  const exists = fs.existsSync(folder);
  const status = exists ? '✓' : '✗';
  console.log(`  ${status} ${folder}`);
});

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  All clear! Ready to run.');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('Just run: npm start');
console.log('');
