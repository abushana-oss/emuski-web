#!/usr/bin/env node

/**
 * SVG Optimization Script for Project Delivery Case Study
 * Optimizes SVG files for better web performance
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SVG_DIR = path.join(process.cwd(), 'public', 'Project_Delivery_Report')
const BACKUP_DIR = path.join(SVG_DIR, 'originals')

async function optimizeSVG(filePath) {
  try {
    let svgContent = await fs.readFile(filePath, 'utf8')
    const originalSize = Buffer.byteLength(svgContent, 'utf8')
    
    // Basic SVG optimizations
    svgContent = svgContent
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove unnecessary whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove trailing whitespace
      .replace(/\s+$/gm, '')
      // Remove leading whitespace
      .replace(/^\s+/gm, '')
      // Minimize stroke and fill attributes
      .replace(/stroke="none"/g, 'stroke="0"')
      .replace(/fill="none"/g, 'fill="0"')
      // Remove default values
      .replace(/stroke-width="1"/g, '')
      .replace(/fill-opacity="1"/g, '')
      .replace(/stroke-opacity="1"/g, '')
      // Compress numbers (remove unnecessary decimals)
      .replace(/(\d+)\.0+(\s|[,)])/g, '$1$2')
      .replace(/(\d+\.\d*?)0+(\s|[,)])/g, '$1$2')

    const optimizedSize = Buffer.byteLength(svgContent, 'utf8')
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)
    
    await fs.writeFile(filePath, svgContent, 'utf8')
    
    return {
      file: path.basename(filePath),
      originalSize: (originalSize / 1024).toFixed(1) + ' KB',
      optimizedSize: (optimizedSize / 1024).toFixed(1) + ' KB',
      savings: savings + '%'
    }
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message)
    return null
  }
}

async function createBackups() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
    const files = await fs.readdir(SVG_DIR)
    
    for (const file of files) {
      if (file.endsWith('.svg')) {
        const sourcePath = path.join(SVG_DIR, file)
        const backupPath = path.join(BACKUP_DIR, file)
        await fs.copyFile(sourcePath, backupPath)
      }
    }
    
    console.log('✅ Created backups in:', BACKUP_DIR)
  } catch (error) {
    console.error('❌ Error creating backups:', error.message)
    process.exit(1)
  }
}

async function main() {
  console.log('🚀 Starting SVG optimization for Project Delivery Case Study...\n')
  
  // Create backups first
  await createBackups()
  
  try {
    const files = await fs.readdir(SVG_DIR)
    const svgFiles = files.filter(file => file.endsWith('.svg'))
    
    if (svgFiles.length === 0) {
      console.log('❌ No SVG files found in:', SVG_DIR)
      return
    }
    
    console.log(`Found ${svgFiles.length} SVG files to optimize...\n`)
    
    const results = []
    
    for (const file of svgFiles) {
      const filePath = path.join(SVG_DIR, file)
      const result = await optimizeSVG(filePath)
      
      if (result) {
        results.push(result)
        console.log(`✅ ${result.file}: ${result.originalSize} → ${result.optimizedSize} (${result.savings} smaller)`)
      }
    }
    
    console.log('\n📊 Optimization Summary:')
    console.log('========================')
    
    const totalOriginal = results.reduce((sum, r) => sum + parseFloat(r.originalSize), 0)
    const totalOptimized = results.reduce((sum, r) => sum + parseFloat(r.optimizedSize), 0)
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)
    
    console.log(`Total original size: ${totalOriginal.toFixed(1)} KB`)
    console.log(`Total optimized size: ${totalOptimized.toFixed(1)} KB`)
    console.log(`Total savings: ${totalSavings}%`)
    console.log(`\n✨ Optimization complete! SVG files are now optimized for web performance.`)
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message)
    process.exit(1)
  }
}

main()