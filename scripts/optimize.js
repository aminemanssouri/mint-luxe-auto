const fs = require('fs');
const path = require('path');

// Performance optimization script
console.log('🚀 Running performance optimizations...');

// Check for large images that should be optimized
const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

function checkImageSizes(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      checkImageSizes(fullPath);
    } else if (imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      const stats = fs.statSync(fullPath);
      const sizeInKB = Math.round(stats.size / 1024);
      
      if (sizeInKB > 500) {
        console.log(`⚠️  Large image found: ${file.name} (${sizeInKB}KB)`);
        console.log(`   Consider optimizing: ${fullPath}`);
      }
    }
  });
}

if (fs.existsSync(publicDir)) {
  checkImageSizes(publicDir);
} else {
  console.log('Public directory not found');
}

console.log('✅ Optimization check complete!');
