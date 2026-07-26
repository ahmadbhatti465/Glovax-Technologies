const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const sharp = require('sharp');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeSvg(filePath, outPath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const result = optimize(data, { path: filePath, multipass: true });
  fs.writeFileSync(outPath, result.data, 'utf8');
  console.log(`Optimized SVG: ${filePath} -> ${outPath} (saved ${(data.length - result.data.length)} bytes)`);
}

async function convertPngToWebp(inputPath, outPath) {
  await sharp(inputPath).webp({ quality: 80 }).toFile(outPath);
  const inSize = fs.statSync(inputPath).size;
  const outSize = fs.statSync(outPath).size;
  console.log(`Converted PNG -> WebP: ${inputPath} -> ${outPath} (from ${inSize} to ${outSize} bytes)`);
}

async function run() {
  const repoRoot = path.resolve(__dirname, '..');
  const publicImages = path.join(repoRoot, 'public', 'images');
  const legacy = path.join(publicImages, 'legacy');
  await ensureDir(legacy);

  // Backup glovax-logo.svg
  const logo = path.join(publicImages, 'glovax-logo.svg');
  if (fs.existsSync(logo)) {
    fs.copyFileSync(logo, path.join(legacy, 'glovax-logo.svg.bak'));
    await optimizeSvg(logo, logo);
  }

  // Convert khanherbals.png to webp
  const khan = path.join(publicImages, 'portfolio', 'khanherbals.png');
  if (fs.existsSync(khan)) {
    const out = path.join(publicImages, 'portfolio', 'khanherbals.webp');
    fs.copyFileSync(khan, path.join(legacy, 'khanherbals.png.bak'));
    await convertPngToWebp(khan, out);
  }

  console.log('Image optimization complete. Large unused SVGs should be moved to legacy separately.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
