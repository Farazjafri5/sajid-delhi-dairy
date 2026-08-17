const { Jimp } = require('jimp');

async function main() {
  console.log("Loading logo image...");
  const inputPath = './public/images/logo.jpg';
  const outputPath = './public/images/logo.png';
  
  const image = await Jimp.read(inputPath);
  
  console.log(`Processing with high-contrast sharpening & feathered alpha (${image.bitmap.width}x${image.bitmap.height})...`);
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Calculate whiteness
    const whiteness = Math.min(r, g, b);
    
    // High-contrast clean cut:
    // If whiteness is above 205 (near white), smoothly transition to transparent.
    if (whiteness > 205) {
      const alphaFactor = (255 - whiteness) / (255 - 205);
      this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, Math.round(255 * alphaFactor)));
      
      // Color correction: blend border pixels with brand charcoal to prevent white borders
      this.bitmap.data[idx + 0] = Math.round(r * alphaFactor + 0x1A * (1 - alphaFactor));
      this.bitmap.data[idx + 1] = Math.round(g * alphaFactor + 0x17 * (1 - alphaFactor));
      this.bitmap.data[idx + 2] = Math.round(b * alphaFactor + 0x15 * (1 - alphaFactor));
    } else {
      // For actual drawing lines (monogram & camera aperture), make the channels slightly darker
      // to increase overall contrast and crispness of the lines.
      this.bitmap.data[idx + 0] = Math.max(0, Math.round(r * 0.90));
      this.bitmap.data[idx + 1] = Math.max(0, Math.round(g * 0.90));
      this.bitmap.data[idx + 2] = Math.max(0, Math.round(b * 0.90));
      this.bitmap.data[idx + 3] = 255; // Keep fully opaque
    }
  });

  console.log("Writing high-contrast transparent logo.png...");
  await image.write(outputPath);
  console.log("Conversion complete! public/images/logo.png is now razor-sharp.");
}

main().catch(err => {
  console.error("Error converting image:", err);
});
