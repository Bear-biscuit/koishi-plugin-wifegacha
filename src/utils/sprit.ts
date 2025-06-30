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
  const tasks = files.flatMap(async file => {
    const inputPath = path.join(inDir, file);
    const baseName = path.parse(file).name + '.png';

    const colorOut = path.join(colDir, baseName);
    const grayOut = path.join(grayOutDir, baseName);

    // 先生成彩色缩略图，宽度80，高度自适应，保持原比例
    const colorBuffer = await sharp(inputPath)
      .resize({ width: width, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: 2, bottom: 2, left: 2, right: 2,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();
    await sharp(colorBuffer).toFile(colorOut);

    // 再生成灰度缩略图
    const grayBuffer = await sharp(inputPath)
      .resize({ width: width, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .grayscale()
      .extend({
        top: 2, bottom: 2, left: 2, right: 2,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();
    await sharp(grayBuffer).toFile(grayOut);
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
    padding = 3
  } = options;

  // 获取所有图片文件
  const grayFiles = fs.readdirSync(grayOutDir).filter(f => /\.(png|jpe?g)$/i.test(f));
  const thumbFiles = [...grayFiles]; // 复制文件列表用于后续处理

  // 读取所有缩略图的尺寸，找出最大高度
  const imageMetas = await Promise.all(thumbFiles.map(async file => {
    const baseName = path.parse(file).name.split(config.wifeNameSeparator)[1];
    const isColor = colorImageNames.includes(baseName);
    const imgPath = isColor ? path.join(colDir, file) : path.join(grayOutDir, file);
    const buffer = await sharp(imgPath)
      .resize({ width: 80, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const meta = await sharp(buffer).metadata();
    return { file, baseName, isColor, width: meta.width, height: meta.height, buffer };
  }));
  const maxHeight = Math.max(...imageMetas.map(m => m.height || 0));

  // 补齐高度，内容上下居中，并加区域边框
  const finalBuffers = await Promise.all(imageMetas.map(async meta => {
    const topPad = Math.floor((maxHeight - (meta.height || 0)) / 2);
    const bottomPad = maxHeight - (meta.height || 0) - topPad;
    // 先生成白底区域
    let region = await sharp({
      create: {
        width: 80,
        height: maxHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .png()
      .toBuffer();
    // 再把图片内容贴到区域中央
    region = await sharp(region)
      .composite([
        { input: meta.buffer, top: topPad, left: 0 }
      ])
      .png()
      .toBuffer();
    // 最后加2px黑色边框
    region = await sharp(region)
      .extend({
        top: 2, bottom: 2, left: 2, right: 2,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();
    return { ...meta, buffer: region, width: 80 + 4, height: maxHeight + 4 };
  }));

  // 计算排版
  const cols = Math.floor(gridWidth / (80 + 4 + padding));
  const rows = Math.ceil(finalBuffers.length / cols);
  let composites = [];
  let y = 10;
  for (let row = 0; row < rows; row++) {
    const rowItems = finalBuffers.slice(row * cols, (row + 1) * cols);
    const rowWidth = rowItems.length * (80 + 4) + (rowItems.length - 1) * padding;
    let x = Math.floor((gridWidth - rowWidth) / 2);
    for (let i = 0; i < rowItems.length; i++) {
      composites.push({ input: rowItems[i].buffer, top: y, left: x });
      x += (80 + 4) + padding;
    }
    y += (maxHeight + 4) + padding;
  }
  const totalHeight = y + 10 - padding;

  const bgResized = await sharp(backgroundPath)
    .resize({ width: gridWidth, height: totalHeight })
    .toBuffer();

  // 直接返回图片的二进制数据
  const imageBuffer = await sharp(bgResized)
    .composite(composites)
    .jpeg({ quality: config.wifeImageQuality })
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
