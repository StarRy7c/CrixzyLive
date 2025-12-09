import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const outDir = 'src/assets/optimized';

async function optimizeImages() {
  try {
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
      console.log(`Created output directory: ${outDir}`);
    }

    const files = await glob('src/assets/images/**/*.@(jpg|jpeg|png)');

    if (files.length === 0) {
      console.log("No images found to optimize.");
      return;
    }

    for (const file of files) {
      // Get the path relative to 'src/assets/images'
      const relativePath = path.relative('src/assets/images', file);
      // Join it with the output directory
      const outPath = path.join(outDir, relativePath);
      
      const finalOutPath = outPath.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const outSubDir = path.dirname(finalOutPath);

      console.log(`Processing: ${file}`);
      console.log(`  Calculated relativePath: ${relativePath}`);
      console.log(`  Calculated outPath: ${outPath}`);
      console.log(`  Calculated finalOutPath: ${finalOutPath}`);
      console.log(`  Calculated outSubDir: ${outSubDir}`);


      if (!fs.existsSync(outSubDir)) {
        fs.mkdirSync(outSubDir, { recursive: true });
        console.log(`  Created subdirectory: ${outSubDir}`);
      }
      
      sharp(file)
        .resize({ width: 1600 }) // resize max width
        .webp({ quality: 75 })
        .toFile(finalOutPath)
        .then(info => console.log(`Optimized ${file} to ${finalOutPath}`, info))
        .catch(err => console.error(`Error optimizing ${file}:`, err));
    }
  } catch (err) {
    console.error("Error during image optimization:", err);
  }
}

optimizeImages();
