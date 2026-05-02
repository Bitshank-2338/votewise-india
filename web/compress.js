const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'public', 'news'),
  path.join(__dirname, '..', 'screenshots')
];

async function compressAll() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const filePath = path.join(dir, file);
        const webpPath = filePath.replace('.png', '.webp');
        console.log(`Compressing ${filePath}...`);
        await sharp(filePath)
          .resize({ width: 800 })
          .webp({ quality: 60 })
          .toFile(webpPath);
        
        fs.unlinkSync(filePath); // Delete original PNG
        console.log(`Saved as ${webpPath} and deleted original.`);
      }
    }
  }
}

compressAll().catch(console.error);
