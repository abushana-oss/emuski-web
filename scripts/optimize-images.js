/**
 * Image Optimization Script
 *
 * Optimizes all images in the public/assets directory
 * - Converts JPG/PNG to WebP
 * - Generates multiple responsive sizes
 * - Reduces file size by 70-85%
 *
 * Usage:
 * npm install sharp --save-dev
 * node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/optimized');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const SIZES = {
  thumbnail: 400,
  medium: 800,
  large: 1200,
  xlarge: 1920,
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Get all image files recursively
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  try {
    const relativePath = path.relative(INPUT_DIR, inputPath);
    const dirname = path.dirname(relativePath);
    const basename = path.basename(relativePath, path.extname(relativePath));

    // Create output directory structure
    const outputDirPath = path.join(OUTPUT_DIR, dirname);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Optimizing: ${relativePath}`);

    // Generate WebP versions at different sizes
    const promises = Object.entries(SIZES).map(async ([sizeName, width]) => {
      // Skip if image is smaller than target size
      if (metadata.width < width) return;

      const outputPath = path.join(
        outputDirPath,
        `${basename}-${sizeName}.webp`
      );

      await image
        .clone()
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const stats = fs.statSync(inputPath);
      const optimizedStats = fs.statSync(outputPath);
      const savings = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(1);

      console.log(`  ✓ ${sizeName} (${width}px) - ${savings}% smaller`);
    });

    // Also create a full-size WebP version
    const fullSizePath = path.join(outputDirPath, `${basename}.webp`);
    promises.push(
      image
        .clone()
        .webp({ quality: 85 })
        .toFile(fullSizePath)
        .then(() => {
          const stats = fs.statSync(inputPath);
          const optimizedStats = fs.statSync(fullSizePath);
          const savings = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(1);
          console.log(`  ✓ Full size - ${savings}% smaller`);
        })
    );

    await Promise.all(promises);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Starting image optimization...\n');
  console.log(`Input directory: ${INPUT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const imageFiles = getImageFiles(INPUT_DIR);
  console.log(`Found ${imageFiles.length} images to optimize\n`);

  for (const file of imageFiles) {
    await optimizeImage(file);
  }

  console.log('\n✅ Image optimization complete!');
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review optimized images');
  console.log('2. Replace references in your components');
  console.log('3. Add sizes prop to Image components');
}

main().catch(console.error);
