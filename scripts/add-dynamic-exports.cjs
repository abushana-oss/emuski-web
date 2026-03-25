/**
 * Script to add dynamic exports to API routes using rate limiting
 */

const fs = require('fs');
const path = require('path');

const API_ROUTES = [
  'app/api/credits/status/route.ts',
  'app/api/image-proxy/route.ts',
  'app/api/blog/route.ts',
  'app/api/cad-engine/health/route.ts',
  'app/api/cad-engine/memory/usage-report/route.ts',
  'app/api/cad-engine/analyze/geometry/route.ts',
  'app/api/s3/signed-url/route.ts',
  'app/api/balloon-diagrams/export/route.ts',
  'app/api/contact/route.ts',
  'app/api/blog/[postId]/route.ts',
  'app/api/analytics/track/route.ts'
];

function addDynamicExport(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if dynamic export already exists
  if (content.includes('export const dynamic')) {
    console.log(`Skipping ${filePath} - dynamic export already exists`);
    return;
  }
  
  // Find the first import statement and add dynamic export after imports
  const lines = content.split('\n');
  const lastImportIndex = lines.findLastIndex(line => line.trim().startsWith('import '));
  
  if (lastImportIndex === -1) {
    console.log(`Skipping ${filePath} - no imports found`);
    return;
  }
  
  // Insert dynamic export after last import
  lines.splice(lastImportIndex + 1, 0, '', 'export const dynamic = \'force-dynamic\'; // Prevent static generation');
  
  const newContent = lines.join('\n');
  fs.writeFileSync(fullPath, newContent);
  console.log(`Added dynamic export to ${filePath}`);
}

// Process all API routes
API_ROUTES.forEach(addDynamicExport);

console.log('Dynamic exports added to API routes');