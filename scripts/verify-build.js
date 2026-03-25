/**
 * Production Build Verification Script
 * Verifies that the production build is working correctly
 */

const fs = require('fs');
const path = require('path');

const buildPath = path.join(process.cwd(), '.next');

function verifyBuild() {
  console.log('🔍 Verifying production build...');
  
  // Check if build directory exists
  if (!fs.existsSync(buildPath)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Check for critical build files
  const criticalFiles = [
    '.next/static',
    '.next/server',
    '.next/BUILD_ID',
    '.next/prerender-manifest.json'
  ];
  
  const missingFiles = criticalFiles.filter(file => 
    !fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing critical build files:', missingFiles);
    process.exit(1);
  }
  
  // Check for chunk files
  const staticPath = path.join(buildPath, 'static');
  if (fs.existsSync(staticPath)) {
    const staticDirs = fs.readdirSync(staticPath);
    const hasChunks = staticDirs.some(dir => {
      const dirPath = path.join(staticPath, dir);
      return fs.statSync(dirPath).isDirectory() && 
             fs.readdirSync(dirPath).some(file => file.endsWith('.js'));
    });
    
    if (!hasChunks) {
      console.warn('⚠️ Warning: No JavaScript chunks found in static directory');
    }
  }
  
  // Check build manifest
  const buildManifestPath = path.join(buildPath, 'build-manifest.json');
  if (fs.existsSync(buildManifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
      console.log('✅ Build manifest valid');
      console.log(`📦 Pages built: ${Object.keys(manifest.pages || {}).length}`);
    } catch (error) {
      console.error('❌ Build manifest is corrupted:', error.message);
      process.exit(1);
    }
  }
  
  // Check for potential issues
  const checksums = [];
  function scanForDuplicates(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        scanForDuplicates(filePath);
      } else if (file.name.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('Connection closed') || content.includes('eo @')) {
          console.warn(`⚠️ Potential issue in ${filePath}: Contains error patterns`);
        }
      }
    }
  }
  
  if (fs.existsSync(staticPath)) {
    scanForDuplicates(staticPath);
  }
  
  console.log('✅ Production build verification complete');
  console.log('🚀 Build appears to be healthy and ready for deployment');
}

// Run verification
verifyBuild();