import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Images to optimize
const imagesToOptimize = [
  // Cost 360 PNG images
  {
    input: join(publicDir, 'assets/engineering/cost360-platform-dashboard.png'),
    output: join(publicDir, 'assets/engineering/cost360-platform-dashboard.webp'),
  },
  {
    input: join(publicDir, 'assets/engineering/cost360-crm-system.png'),
    output: join(publicDir, 'assets/engineering/cost360-crm-system.webp'),
  },
  // Bloated SVG files (will be converted to WebP from embedded images)
  {
    input: join(publicDir, 'assets/mitran/ai-mithran-ai.svg'),
    output: join(publicDir, 'assets/mitran/ai-mithran-ai.webp'),
  },
  {
    input: join(publicDir, 'assets/mitran/ai-raw-material-optimization.svg'),
    output: join(publicDir, 'assets/mitran/ai-raw-material-optimization.webp'),
  },
  {
    input: join(publicDir, 'assets/mitran/ai-mitran-future.svg'),
    output: join(publicDir, 'assets/mitran/ai-mitran-future.webp'),
  },
];

async function optimizeImage(input, output) {
  try {
    console.log(`Optimizing: ${input}`);

    // Read the file
    let imageBuffer;
    if (input.endsWith('.svg')) {
      // For SVG files with embedded images, we'll use sharp to rasterize them
      const svgContent = readFileSync(input, 'utf-8');
      imageBuffer = Buffer.from(svgContent);
    } else {
      imageBuffer = readFileSync(input);
    }

    // Convert to WebP with high quality but good compression
    await sharp(imageBuffer)
      .webp({
        quality: 85, // Good balance between quality and file size
        effort: 6,   // Higher effort = better compression (0-6)
      })
      .toFile(output);

    // Get file sizes for comparison
    const originalSize = readFileSync(input).length;
    const optimizedSize = readFileSync(output).length;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    console.log(`✓ Saved: ${output}`);
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Optimized: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Reduction: ${reduction}%\n`);
  } catch (error) {
    console.error(`Error optimizing ${input}:`, error.message);
  }
}

// Generate blur placeholder for progressive loading
async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10) // Very small size for blur placeholder
      .webp({ quality: 20 })
      .toBuffer();

    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting image optimization...\n');

  for (const { input, output } of imagesToOptimize) {
    await optimizeImage(input, output);
  }

  console.log('\n✨ Image optimization complete!');
  console.log('\nGenerating blur placeholders...\n');

  // Generate blur placeholders
  const placeholders = {};
  for (const { output } of imagesToOptimize) {
    const key = output.replace(publicDir, '').replace(/\\/g, '/');
    const placeholder = await generateBlurPlaceholder(output);
    if (placeholder) {
      placeholders[key] = placeholder;
      console.log(`✓ Generated blur placeholder for: ${key}`);
    }
  }

  // Save placeholders to a JSON file for easy import
  const placeholdersPath = join(__dirname, '..', 'src', 'data', 'image-placeholders.json');
  writeFileSync(placeholdersPath, JSON.stringify(placeholders, null, 2));
  console.log(`\n✓ Saved blur placeholders to: ${placeholdersPath}`);
}

main().catch(console.error);
