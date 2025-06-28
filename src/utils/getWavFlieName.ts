import fs from "fs";
import path from "path";

/**
 * 从指定文件夹中随机选择一个WAV文件
 * @param {string} folderPath 文件夹路径
 * @returns {string|null} 随机选择的WAV文件名，如果没有WAV文件则返回null
 */
export function getRandomWavFile(folderPath: string) {
  try {
    // 读取文件夹中的所有文件
    const files = fs.readdirSync(folderPath);

    // 筛选出所有WAV文件
    const wavFiles = files.filter(file =>
      path.extname(file).toLowerCase() === '.wav'
    );

    // 如果没有WAV文件，返回null
    if (wavFiles.length === 0) {
      console.error('文件夹中没有WAV文件', folderPath);
      return null;
    }

    // 随机选择一个WAV文件
    const randomIndex = Math.floor(Math.random() * wavFiles.length);
    return wavFiles[randomIndex];

  } catch (error) {
    console.error('获取随机WAV文件时出错:', error);
    return null;
  }
}
