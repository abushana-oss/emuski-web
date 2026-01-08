import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// SVG files to extract and convert
const svgFiles = [
  {
    input: join(publicDir, 'assets/mitran/ai-mithran-ai.svg'),
    output: join(publicDir, 'assets/mitran/ai-mithran-ai.webp'),
  },
  {
    input: join(publicDir, 'assets/mitran/ai-raw-material-optimization.svg'),
    output: join(publicDir, 'assets/mitran/ai-raw-material-optimization.webp'),
  },
];

function extractBase64Image(svgContent) {
  // Find base64 encoded image in the SVG
  const regex = /data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/;
  const match = svgContent.match(regex);

  if (match) {
    return {
      format: match[1],
      data: match[2]
    };
  }

  return null;
}

async function convertSvgToWebp(inputPath, outputPath) {
  try {
    console.log(`Processing: ${inputPath}`);

    // Read SVG file in chunks to avoid memory issues
    const svgContent = readFileSync(inputPath, 'utf-8');
    const originalSize = readFileSync(inputPath).length;

    console.log(`  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Extracting embedded image...`);

    // Extract base64 image
    const imageData = extractBase64Image(svgContent);

    if (!imageData) {
      console.error(`  ✗ No embedded image found in ${inputPath}`);
      return;
    }

    console.log(`  Found embedded ${imageData.format.toUpperCase()} image`);
    console.log(`  Converting to WebP...`);

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData.data, 'base64');

    // Convert to WebP
    await sharp(imageBuffer)
      .webp({
        quality: 85,
        effort: 6,
      })
      .toFile(outputPath);

    const optimizedSize = readFileSync(outputPath).length;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    console.log(`  ✓ Saved: ${outputPath}`);
    console.log(`  Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Reduction: ${reduction}%\n`);

  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }
}

async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10)
      .webp({ quality: 20 })
      .toBuffer();

    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur placeholder:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Extracting and converting SVG embedded images...\n');

  for (const { input, output } of svgFiles) {
    await convertSvgToWebp(input, output);
  }

  console.log('Generating blur placeholders...\n');

  const placeholders = {};
  for (const { output } of svgFiles) {
    const key = output.replace(publicDir, '').replace(/\\/g, '/');
    const placeholder = await generateBlurPlaceholder(output);
    if (placeholder) {
      placeholders[key] = placeholder;
      console.log(`✓ Generated blur placeholder for: ${key}`);
    }
  }

  // Update the placeholders file
  const placeholdersPath = join(__dirname, '..', 'src', 'data', 'image-placeholders.json');
  let existingPlaceholders = {};
  try {
    existingPlaceholders = JSON.parse(readFileSync(placeholdersPath, 'utf-8'));
  } catch (e) {
    // File doesn't exist yet
  }

  const mergedPlaceholders = { ...existingPlaceholders, ...placeholders };
  writeFileSync(placeholdersPath, JSON.stringify(mergedPlaceholders, null, 2));

  console.log(`\n✨ Conversion complete!`);
  console.log(`Saved blur placeholders to: ${placeholdersPath}`);
}

main().catch(console.error);
