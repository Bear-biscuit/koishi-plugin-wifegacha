import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Context } from 'koishi';

// === 配置路径 ===
let inputDir = "";
if (path.join(__dirname).split("\\").pop()=="utils"){
  inputDir = path.join(__dirname, '../../../..', 'data/assets/wifegacha');
}else{
  inputDir = path.join(__dirname, '../../..', 'data/assets/wifegacha');
}
let resizedDir = "";
if (path.join(__dirname).split("\\").pop()=="utils"){
  resizedDir = path.join(__dirname, '../../../..', 'data/assets/resized');
}else{
  resizedDir = path.join(__dirname, '../../..', 'data/assets/resized');
}
const colorDir = path.join(resizedDir, 'color');
const grayDir = path.join(resizedDir, 'gray');
let renderMixDir = "";
if (path.join(__dirname).split("\\").pop()=="utils"){
  renderMixDir = path.join(__dirname, '../../../..', 'data/assets/render_mix');
}else{
  renderMixDir = path.join(__dirname, '../../..', 'data/assets/render_mix');
}
let backgroundImagePath = "";
if (path.join(__dirname).split("\\").pop()=="utils"){
  backgroundImagePath = path.join(__dirname, '../../../..', 'data/assets/bj.png');
}else{
  backgroundImagePath = path.join(__dirname, '../../..', 'data/assets/bj.png');
}

// === 初始化目录 ===
function ensureDirs() {
  for (const dir of [resizedDir, colorDir, grayDir, renderMixDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

// === 缩略图生成（彩色+灰度） ===
/**
 * 生成彩色和灰度缩略图
 * @param {Object} options - 配置选项
 * @param {string} options.inputDir - 输入目录路径
 * @param {string} options.colorDir - 彩色缩略图输出目录
 * @param {string} options.grayDir - 灰度缩略图输出目录
 * @param {number} options.width - 缩略图宽度
 * @param {number} options.height - 缩略图高度
 * @returns {Promise<void>}
 */
async function generateThumbnails(ctx: Context, options: {
  inputDir?: string;
  colorDir?: string;
  grayDir?: string;
  width?: number;
  height?: number;
} = {}): Promise<{
  colorFiles: string[];
  colorDir: string;
  grayDir: string;
}> {
  const {
    inputDir: inDir = inputDir,
    colorDir: colDir = colorDir,
    grayDir: grayOutDir = grayDir,
    width = 80,
    height = 80
  } = options;

  // 确保目录存在
  for (const dir of [colDir, grayOutDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  // 清空输出目录
  fs.readdirSync(colDir).forEach(file => fs.unlinkSync(path.join(colDir, file)));
  fs.readdirSync(grayOutDir).forEach(file => fs.unlinkSync(path.join(grayOutDir, file)));

  const files = fs.readdirSync(inDir).filter(name => /\.(png|jpe?g)$/i.test(name));
  const tasks = files.flatMap(file => {
    const inputPath = path.join(inDir, file);
    const baseName = path.parse(file).name + '.png';

    const colorOut = path.join(colDir, baseName);
    const grayOut = path.join(grayOutDir, baseName);

    return [
      sharp(inputPath).resize(width, height, { fit: 'fill' }).toFile(colorOut),
      sharp(inputPath).resize(width, height, { fit: 'fill' }).grayscale().toFile(grayOut)
    ];
  });

  await Promise.all(tasks);
  ctx.logger.info('缩略图初始化完成')
  ctx.logger.info('✅ 缩略图已生成（彩色 + 灰度）');

  return {
    colorFiles: files.map(file => path.parse(file).name + '.png'),
    colorDir: colDir,
    grayDir: grayOutDir
  };
}

/**
 * 准备混合渲染目录（灰度为主，指定图片使用彩色）
 * @param {string[]} useColorNames - 需要使用彩色版本的图片名称数组
 * @param {Object} options - 配置选项
 * @param {string} options.colorDir - 彩色图片目录
 * @param {string} options.grayDir - 灰度图片目录
 * @param {string} options.outputDir - 输出目录
 * @returns {string} 输出目录路径
 */
function prepareRenderMix(ctx: Context, useColorNames, options: {
  colorDir?: string;
  grayDir?: string;
  outputDir?: string;
} = {}) {
  const {
    colorDir: colDir = colorDir,
    grayDir: grayOutDir = grayDir,
    outputDir: outDir = renderMixDir
  } = options;

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 清空输出目录
  fs.readdirSync(outDir).forEach(file => fs.unlinkSync(path.join(outDir, file)));

  const grayFiles = fs.readdirSync(grayOutDir);

  for (const file of grayFiles) {
    const baseName = path.parse(file).name;

    const isColor = useColorNames.includes(baseName);
    const source = isColor
      ? path.join(colDir, file)
      : path.join(grayOutDir, file);

    const dest = path.join(outDir, file);
    fs.copyFileSync(source, dest);
  }

  ctx.logger.info(`✅ ${outDir} 目录已准备（彩色混入灰度）`);
  return outDir;
}

/**
 * 生成带背景混合图
 * @param {string[]} colorImageNames - 需要使用彩色版本的图片名称数组
 * @param {Object} options - 配置选项
 * @param {string} options.backgroundPath - 背景图片路径
 * @param {string} options.colorDir - 彩色图片目录
 * @param {string} options.grayDir - 灰度图片目录
 * @param {string} options.outputPath - 输出文件路径
 * @param {number} options.imageSize - 图片大小
 * @param {number} options.gridWidth - 网格宽度
 * @param {number} options.padding - 图片间距
 * @returns {Promise<string>} 输出文件路径
 */
async function generateMixedBackgroundImage(ctx: Context, colorImageNames, options: {
  backgroundPath?: string;
  colorDir?: string;
  grayDir?: string;
  outputPath?: string;
  imageSize?: number;
  gridWidth?: number;
  padding?: number;
} = {}) {
  const {
    backgroundPath = backgroundImagePath,
    colorDir: colDir = colorDir,
    grayDir: grayOutDir = grayDir,
    imageSize = 80,
    gridWidth = 567,
    padding = 5
  } = options;

  // 准备混合渲染目录
  const mixDir = prepareRenderMix(ctx, colorImageNames, {
    colorDir: colDir,
    grayDir: grayOutDir,
    outputDir: renderMixDir
  });

  // 渲染到背景图上
  const thumbs = fs.readdirSync(mixDir).filter(f => /\.(png|jpe?g)$/i.test(f));
  const cols = Math.floor(gridWidth / (imageSize + padding));
  const rows = Math.ceil(thumbs.length / cols);
  const totalHeight = rows * (imageSize + padding) + 20 - padding;

  const composites = [];

  for (let i = 0; i < thumbs.length; i++) {
    const file = thumbs[i];
    const imgPath = path.join(mixDir, file);

    const row = Math.floor(i / cols);
    const col = i % cols;

    const itemsInRow = (row === rows - 1 && thumbs.length % cols !== 0) ? thumbs.length % cols : cols;
    const rowWidth = itemsInRow * imageSize + (itemsInRow - 1) * padding;
    const offsetX = Math.floor((gridWidth - rowWidth) / 2);
    const x = col * (imageSize + padding) + offsetX;
    const y = row * (imageSize + padding) + 10;

    composites.push({ input: imgPath, top: y, left: x });
  }

  const bgResized = await sharp(backgroundPath)
    .resize({ width: gridWidth, height: totalHeight })
    .toBuffer();

  // 不生成文件，直接返回图片的二进制数据
  const imageBuffer = await sharp(bgResized)
    .composite(composites)
    .jpeg({ quality: 75 })
    .toBuffer();

  ctx.logger.info('🎉 图鉴生成完成，图片大小：', imageBuffer.length);
  return imageBuffer;
}

// 导出函数，以便外部调用
export default {
  /**
   * 初始化目录
   */
  ensureDirs,
  /**
   * 生成缩略图
   */
  generateThumbnails,
  /**
   * 生成带背景混合图
   */
  generateMixedBackgroundImage
};
