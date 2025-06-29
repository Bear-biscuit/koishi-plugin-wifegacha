import fs from 'fs';

export default async function readImageAsBinarySync(imagePath: string): Promise<Buffer> {
  try {
    return fs.readFileSync(imagePath);
  } catch (error) {
    throw new Error(`读取图片失败: ${error.message}`);
  }
}