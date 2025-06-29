import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Context } from 'koishi';
import { Config } from '../index';

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
  backgroundImagePath = path.join(__dirname, 'bj.png');
}else{
  backgroundImagePath = path.join(__dirname, 'bj.png');
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
 * 生成带背景混合图
 * @param {string[]} colorImageNames - 需要使用彩色版本的图片名称数组
 * @param {Object} options - 配置选项
 * @param {string} options.backgroundPath - 背景图片路径
 * @param {string} options.colorDir - 彩色图片目录
 * @param {string} options.grayDir - 灰度图片目录
 * @param {number} options.imageSize - 图片大小
 * @param {number} options.gridWidth - 网格宽度
 * @param {number} options.padding - 图片间距
 * @returns {Promise<Buffer>} 输出图片的Buffer
 */
async function generateMixedBackgroundImage(ctx: Context, config:Config, colorImageNames, options: {
  backgroundPath?: string;
  colorDir?: string;
  grayDir?: string;
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

  // 获取所有图片文件
  const grayFiles = fs.readdirSync(grayOutDir).filter(f => /\.(png|jpe?g)$/i.test(f));
  const thumbFiles = [...grayFiles]; // 复制文件列表用于后续处理

  const composites = [];
  const cols = Math.floor(gridWidth / (imageSize + padding));
  const rows = Math.ceil(thumbFiles.length / cols);
  const totalHeight = rows * (imageSize + padding) + 20 - padding;

  // 处理每一个图片，决定使用彩色还是灰度
  for (let i = 0; i < thumbFiles.length; i++) {
    const file = thumbFiles[i];
    const baseName = path.parse(file).name.split(config.wifeNameSeparator)[1];
    const isColor = colorImageNames.includes(baseName);

    // 选择使用彩色还是灰度图片
    const imgPath = isColor
      ? path.join(colDir, file)
      : path.join(grayOutDir, file);

    const row = Math.floor(i / cols);
    const col = i % cols;

    const itemsInRow = (row === rows - 1 && thumbFiles.length % cols !== 0) ? thumbFiles.length % cols : cols;
    const rowWidth = itemsInRow * imageSize + (itemsInRow - 1) * padding;
    const offsetX = Math.floor((gridWidth - rowWidth) / 2);
    const x = col * (imageSize + padding) + offsetX;
    const y = row * (imageSize + padding) + 10;

    composites.push({ input: imgPath, top: y, left: x });
  }

  const bgResized = await sharp(backgroundPath)
    .resize({ width: gridWidth, height: totalHeight })
    .toBuffer();

  // 直接返回图片的二进制数据
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
