var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi15 = require("koishi");
var import_fs10 = require("fs");
var import_path10 = __toESM(require("path"));

// src/module/wifeUser.ts
function wifeUser(ctx, config) {
  ctx.model.extend("wifeUser", {
    id: "unsigned",
    userId: "string",
    groupId: "string",
    wifeName: "string",
    operationDate: "timestamp",
    ntrOrdinal: "integer",
    fuckWifeDate: "timestamp",
    lpdaDate: "timestamp",
    wifeHistories: "json",
    interactionWithOtherUser: "json",
    createdAt: "timestamp",
    ntrCount: "integer",
    ntrTotalCount: "integer",
    ntrSuccessCount: "integer",
    drawCount: "integer",
    exchangeCount: "integer",
    divorceCount: "integer",
    totalAffection: "integer",
    targetNtrCount: "integer",
    targetNtrSuccessCount: "integer"
  }, {
    autoInc: true
  });
  ctx.logger.info("wifeUser 表初始化完成");
}
__name(wifeUser, "wifeUser");

// src/module/wifeData.ts
function wifeData(ctx, config) {
  ctx.model.extend(
    "wifeData",
    {
      id: "unsigned",
      name: "string",
      comeFrom: "string",
      filepath: "string",
      createdAt: "timestamp",
      updatedAt: "timestamp",
      groupData: "json"
    },
    {
      autoInc: true
    }
  );
  ctx.logger.info("wifeData 表初始化完成");
}
__name(wifeData, "wifeData");

// src/module/groupData.ts
function groupData(ctx, config) {
  ctx.model.extend("groupData", {
    id: "unsigned",
    groupId: "string",
    drawCount: "integer",
    ntrTotalCount: "integer",
    ntrSuccessCount: "integer",
    exchangeCount: "integer",
    divorceTotalCount: "integer",
    fuckTotalCount: "integer"
  }, {
    autoInc: true
  });
  ctx.logger.info("groupData 表初始化完成");
}
__name(groupData, "groupData");

// src/module/index.ts
async function module2(ctx, config) {
  wifeUser(ctx, config);
  wifeData(ctx, config);
  groupData(ctx, config);
}
__name(module2, "module");

// src/utils/createWifeData.ts
var import_fs2 = require("fs");
var import_path2 = __toESM(require("path"));

// src/utils/sprit.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_sharp = __toESM(require("sharp"));
var inputDir = "";
if (import_path.default.join(__dirname).split("\\").pop() == "utils") {
  inputDir = import_path.default.join(__dirname, "../../../..", "data/assets/wifegacha");
} else {
  inputDir = import_path.default.join(__dirname, "../../..", "data/assets/wifegacha");
}
var resizedDir = "";
if (import_path.default.join(__dirname).split("\\").pop() == "utils") {
  resizedDir = import_path.default.join(__dirname, "../../../..", "data/assets/resized");
} else {
  resizedDir = import_path.default.join(__dirname, "../../..", "data/assets/resized");
}
var colorDir = import_path.default.join(resizedDir, "color");
var grayDir = import_path.default.join(resizedDir, "gray");
var renderMixDir = "";
if (import_path.default.join(__dirname).split("\\").pop() == "utils") {
  renderMixDir = import_path.default.join(__dirname, "../../../..", "data/assets/render_mix");
} else {
  renderMixDir = import_path.default.join(__dirname, "../../..", "data/assets/render_mix");
}
var backgroundImagePath = "";
if (import_path.default.join(__dirname).split("\\").pop() == "utils") {
  backgroundImagePath = import_path.default.join(__dirname, "bj.png");
} else {
  backgroundImagePath = import_path.default.join(__dirname, "bj.png");
}
function ensureDirs() {
  for (const dir of [resizedDir, colorDir, grayDir, renderMixDir]) {
    if (!import_fs.default.existsSync(dir)) import_fs.default.mkdirSync(dir, { recursive: true });
  }
}
__name(ensureDirs, "ensureDirs");
async function generateThumbnails(ctx, options = {}) {
  const {
    inputDir: inDir = inputDir,
    colorDir: colDir = colorDir,
    grayDir: grayOutDir = grayDir,
    width = 80,
    height = 80
  } = options;
  for (const dir of [colDir, grayOutDir]) {
    if (!import_fs.default.existsSync(dir)) import_fs.default.mkdirSync(dir, { recursive: true });
  }
  import_fs.default.readdirSync(colDir).forEach((file) => import_fs.default.unlinkSync(import_path.default.join(colDir, file)));
  import_fs.default.readdirSync(grayOutDir).forEach((file) => import_fs.default.unlinkSync(import_path.default.join(grayOutDir, file)));
  const files = import_fs.default.readdirSync(inDir).filter((name2) => /\.(png|jpe?g)$/i.test(name2));
  const tasks = files.flatMap(async (file) => {
    const inputPath = import_path.default.join(inDir, file);
    const baseName = import_path.default.parse(file).name + ".png";
    const colorOut = import_path.default.join(colDir, baseName);
    const grayOut = import_path.default.join(grayOutDir, baseName);
    const colorBuffer = await (0, import_sharp.default)(inputPath).resize({ width, fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } }).extend({
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }).png().toBuffer();
    await (0, import_sharp.default)(colorBuffer).toFile(colorOut);
    const grayBuffer = await (0, import_sharp.default)(inputPath).resize({ width, fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } }).grayscale().extend({
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }).png().toBuffer();
    await (0, import_sharp.default)(grayBuffer).toFile(grayOut);
  });
  await Promise.all(tasks);
  ctx.logger.info("缩略图初始化完成");
  ctx.logger.info("✅ 缩略图已生成（彩色 + 灰度）");
  return {
    colorFiles: files.map((file) => import_path.default.parse(file).name + ".png"),
    colorDir: colDir,
    grayDir: grayOutDir
  };
}
__name(generateThumbnails, "generateThumbnails");
async function generateMixedBackgroundImage(ctx, config, colorImageNames, options = {}) {
  const {
    backgroundPath = backgroundImagePath,
    colorDir: colDir = colorDir,
    grayDir: grayOutDir = grayDir,
    imageSize = 80,
    gridWidth = 567,
    padding = 3
  } = options;
  const grayFiles = import_fs.default.readdirSync(grayOutDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  const thumbFiles = [...grayFiles];
  const imageMetas = await Promise.all(thumbFiles.map(async (file) => {
    const baseName = import_path.default.parse(file).name.split(config.wifeNameSeparator)[1];
    const isColor = colorImageNames.includes(baseName);
    const imgPath = isColor ? import_path.default.join(colDir, file) : import_path.default.join(grayOutDir, file);
    const buffer = await (0, import_sharp.default)(imgPath).resize({ width: 80, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const meta = await (0, import_sharp.default)(buffer).metadata();
    return { file, baseName, isColor, width: meta.width, height: meta.height, buffer };
  }));
  const maxHeight = Math.max(...imageMetas.map((m) => m.height || 0));
  const finalBuffers = await Promise.all(imageMetas.map(async (meta) => {
    const topPad = Math.floor((maxHeight - (meta.height || 0)) / 2);
    const bottomPad = maxHeight - (meta.height || 0) - topPad;
    let region = await (0, import_sharp.default)({
      create: {
        width: 80,
        height: maxHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    }).png().toBuffer();
    region = await (0, import_sharp.default)(region).composite([
      { input: meta.buffer, top: topPad, left: 0 }
    ]).png().toBuffer();
    region = await (0, import_sharp.default)(region).extend({
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }).png().toBuffer();
    return { ...meta, buffer: region, width: 80 + 4, height: maxHeight + 4 };
  }));
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
      x += 80 + 4 + padding;
    }
    y += maxHeight + 4 + padding;
  }
  const totalHeight = y + 10 - padding;
  const bgResized = await (0, import_sharp.default)(backgroundPath).resize({ width: gridWidth, height: totalHeight }).toBuffer();
  const imageBuffer = await (0, import_sharp.default)(bgResized).composite(composites).jpeg({ quality: config.wifeImageQuality }).toBuffer();
  ctx.logger.info("🎉 图鉴生成完成，图片大小：", imageBuffer.length);
  return imageBuffer;
}
__name(generateMixedBackgroundImage, "generateMixedBackgroundImage");
var sprit_default = {
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

// src/utils/createWifeData.ts
var wifegachaPath = "";
if (import_path2.default.join(__dirname).split("\\").pop() == "utils") {
  wifegachaPath = import_path2.default.join(
    __dirname,
    "../../../..",
    "data/assets/wifegacha"
  );
} else {
  wifegachaPath = import_path2.default.join(
    __dirname,
    "../../..",
    "data/assets/wifegacha"
  );
}
function createWifeData(ctx, config) {
  const files = (0, import_fs2.readdirSync)(wifegachaPath);
  for (const file of files) {
    const parsed = import_path2.default.parse(file);
    const splitName = config.wifeNameSeparator;
    const wifeName = parsed.name.split(splitName)[1];
    const comeFrom = parsed.name.split(splitName)[0];
    ctx.database.create("wifeData", {
      name: wifeName,
      comeFrom,
      filepath: import_path2.default.join(wifegachaPath, file),
      createdAt: /* @__PURE__ */ new Date(),
      groupData: []
    });
  }
  ctx.logger.info("wifeData表初始化完成");
  sprit_default.generateThumbnails(ctx);
}
__name(createWifeData, "createWifeData");

// src/command/clp.ts
var import_koishi = require("koishi");

// src/utils/createUserData.ts
async function createUserData(ctx, session) {
  if ((await ctx.database.get("wifeUser", {
    userId: session.userId,
    groupId: session.channelId.toString()
  })).length === 0) {
    const today = /* @__PURE__ */ new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    ctx.logger.info("还没有抽过老婆，创建用户数据");
    ctx.database.create("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString(),
      wifeHistories: [],
      ntrOrdinal: 0,
      createdAt: /* @__PURE__ */ new Date(),
      ntrCount: 0,
      ntrTotalCount: 0,
      ntrSuccessCount: 0,
      drawCount: 0,
      exchangeCount: 0,
      divorceCount: 0,
      totalAffection: 0,
      targetNtrCount: 0,
      targetNtrSuccessCount: 0,
      interactionWithOtherUser: [],
      operationDate: yesterday,
      lpdaDate: yesterday
    });
  }
}
__name(createUserData, "createUserData");

// src/utils/createGroupData.ts
async function createGroupData(ctx, session) {
  if ((await ctx.database.get("groupData", {
    groupId: session.channelId.toString()
  })).length === 0) {
    ctx.logger.info("还没有创建群数据，创建群数据");
    ctx.database.create("groupData", {
      groupId: session.channelId.toString(),
      drawCount: 0,
      ntrTotalCount: 0,
      ntrSuccessCount: 0,
      exchangeCount: 0,
      divorceTotalCount: 0,
      fuckTotalCount: 0
    });
  }
}
__name(createGroupData, "createGroupData");

// src/utils/createGroupWifeData.ts
async function createGroupWifeData(ctx, session, wifename) {
  const wifeData2 = (await ctx.database.get("wifeData", {
    name: wifename
  }))[0];
  if (!wifeData2.groupData.find((item) => item.groupId === session.channelId.toString())) {
    ctx.logger.info("该老婆在当前群中没有数据，创建数据");
    wifeData2.groupData.push({
      groupId: session.channelId.toString(),
      drawCount: 0,
      ntrCount: 0,
      fuckCount: 0,
      divorceCount: 0,
      ntrFailCount: 0
    });
    await ctx.database.set("wifeData", {
      name: wifename
    }, {
      groupData: wifeData2.groupData
    });
  }
}
__name(createGroupWifeData, "createGroupWifeData");

// src/utils/createTarget.ts
async function createTarget(ctx, session, userId) {
  if ((await ctx.database.get("wifeUser", {
    userId,
    groupId: session.channelId.toString()
  })).length === 0) {
    const today = /* @__PURE__ */ new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    ctx.logger.info("还没有抽过老婆，创建用户数据");
    ctx.database.create("wifeUser", {
      userId,
      groupId: session.channelId.toString(),
      wifeHistories: [],
      interactionWithOtherUser: [],
      ntrOrdinal: 0,
      createdAt: /* @__PURE__ */ new Date(),
      ntrCount: 0,
      ntrTotalCount: 0,
      ntrSuccessCount: 0,
      drawCount: 0,
      exchangeCount: 0,
      divorceCount: 0,
      totalAffection: 0,
      targetNtrCount: 0,
      targetNtrSuccessCount: 0,
      operationDate: yesterday
    });
  }
}
__name(createTarget, "createTarget");

// src/utils/isSameDay.ts
async function isSameDay(ctx, inputTime, session) {
  const userData = (await ctx.database.get("wifeUser", {
    userId: session.userId,
    groupId: session.channelId.toString()
  }))[0];
  if (!userData.operationDate) {
    userData.operationDate = new Date(Date.now() - 24 * 60 * 60 * 1e3);
  }
  const inputDateOnly = inputTime.toString().split("T")[0];
  const storedDateOnly = userData.operationDate.toString().split("T")[0];
  return inputDateOnly === storedDateOnly;
}
__name(isSameDay, "isSameDay");

// src/utils/getWifeName.ts
var wifeNameArray = /* @__PURE__ */ new Map();
async function checkGroupDate(ctx, group, inputTime, session) {
  if (!wifeNameArray.has(group)) {
    wifeNameArray.set(group, {
      "wifeName": (await ctx.database.get("wifeData", {})).map((item) => item.name)
    });
  }
  const userData = (await ctx.database.get("wifeUser", {
    userId: session.userId,
    groupId: session.channelId.toString()
  }))[0];
  if (await isSameDay(ctx, inputTime, session)) {
    if (userData.wifeName) {
      return null;
    }
    if (wifeNameArray.get(group)["wifeName"].length === 0) {
      return null;
    }
    const wifeNames = wifeNameArray.get(group)["wifeName"];
    const index = Math.floor(Math.random() * wifeNames.length);
    const [removed] = wifeNameArray.get(group)["wifeName"].splice(index, 1);
    return removed;
  } else {
    if (userData.wifeName) {
      ctx.database.set("wifeUser", { userId: session.userId, groupId: session.channelId.toString() }, { wifeName: "" });
    }
    ctx.database.set("wifeUser", { userId: session.userId, groupId: session.channelId.toString() }, { operationDate: /* @__PURE__ */ new Date() });
    wifeNameArray.get(group)["wifeName"] = (await ctx.database.get("wifeData", {})).map((item) => item.name);
    return checkGroupDate(ctx, group, inputTime, session);
  }
}
__name(checkGroupDate, "checkGroupDate");

// src/utils/affectionLevel.ts
function affectionLevel(affection) {
  if (affection < 10) {
    return 0;
  }
  if (affection < 20) {
    return 1;
  }
  if (affection < 30) {
    return 2;
  }
  if (affection < 40) {
    return 3;
  }
  if (affection < 50) {
    return 4;
  }
  if (affection < 60) {
    return 5;
  }
  if (affection < 70) {
    return 6;
  }
  if (affection < 80) {
    return 7;
  }
  if (affection < 90) {
    return 8;
  }
  return 9;
}
__name(affectionLevel, "affectionLevel");

// src/utils/getWavFlieName.ts
var import_fs3 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
function getRandomWavFile(folderPath) {
  try {
    const files = import_fs3.default.readdirSync(folderPath);
    const wavFiles = files.filter(
      (file) => import_path3.default.extname(file).toLowerCase() === ".wav"
    );
    if (wavFiles.length === 0) {
      console.error("文件夹中没有WAV文件", folderPath);
      return null;
    }
    const randomIndex = Math.floor(Math.random() * wavFiles.length);
    return wavFiles[randomIndex];
  } catch (error) {
    console.error("获取随机WAV文件时出错:", error);
    return null;
  }
}
__name(getRandomWavFile, "getRandomWavFile");

// src/utils/upWifeData.ts
var import_fs4 = require("fs");
var import_path4 = __toESM(require("path"));
var wifegachaPath2 = "";
if (import_path4.default.join(__dirname).split("\\").pop() == "utils") {
  wifegachaPath2 = import_path4.default.join(
    __dirname,
    "../../../..",
    "data/assets/wifegacha"
  );
} else {
  wifegachaPath2 = import_path4.default.join(
    __dirname,
    "../../..",
    "data/assets/wifegacha"
  );
}
async function upWifeData(ctx, config) {
  const wifeData2 = await ctx.database.get("wifeData", {});
  const files = (0, import_fs4.readdirSync)(wifegachaPath2);
  for (const file of files) {
    const parsed = import_path4.default.parse(file);
    const splitName = config.wifeNameSeparator;
    const wifeName = parsed.name.split(splitName)[1];
    const comeFrom = parsed.name.split(splitName)[0];
    if (wifeData2.find((item) => item.name === wifeName)) {
      await ctx.database.set("wifeData", { name: wifeName }, {
        comeFrom,
        filepath: import_path4.default.join(wifegachaPath2, file)
      });
      continue;
    }
    ctx.logger.info("创建老婆数据", wifeName);
    await ctx.database.create("wifeData", {
      name: wifeName,
      comeFrom,
      filepath: import_path4.default.join(wifegachaPath2, file),
      createdAt: /* @__PURE__ */ new Date(),
      groupData: []
    });
  }
  const wifeNewData = await ctx.database.get("wifeData", {});
  for (const item of wifeNewData) {
    const fileNameList = files.map((file) => import_path4.default.parse(file).name.split(config.wifeNameSeparator)[1]);
    if (!fileNameList.includes(item.name)) {
      ctx.logger.info("删除老婆数据", item.comeFrom + config.wifeNameSeparator + item.name);
      await ctx.database.remove("wifeData", { name: item.name });
    }
  }
  ctx.logger.info("wifeData表更新完成");
  sprit_default.generateThumbnails(ctx);
}
__name(upWifeData, "upWifeData");

// src/utils/createInteraction.ts
async function createInteraction(ctx, session, otherUserId) {
  const wifeUser2 = await ctx.database.get("wifeUser", {
    userId: session.userId,
    groupId: session.channelId.toString()
  });
  if (!wifeUser2[0].interactionWithOtherUser.find((item) => item.otherUserId === otherUserId && item.groupId === session.channelId.toString())) {
    ctx.logger.info("没有与该用户交互，创建数据");
    wifeUser2[0].interactionWithOtherUser.push({
      otherUserId,
      groupId: session.channelId.toString(),
      ntrCount: 0,
      ntrSuccessCount: 0,
      exchangeCount: 0
    });
    await ctx.database.set("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }, {
      interactionWithOtherUser: wifeUser2[0].interactionWithOtherUser
    });
  }
  const targetWifeUser = await ctx.database.get("wifeUser", {
    userId: otherUserId,
    groupId: session.channelId.toString()
  });
  if (!targetWifeUser[0].interactionWithOtherUser.find((item) => item.otherUserId === session.userId && item.groupId === session.channelId.toString())) {
    targetWifeUser[0].interactionWithOtherUser.push({
      otherUserId: session.userId,
      groupId: session.channelId.toString(),
      ntrCount: 0,
      ntrSuccessCount: 0,
      exchangeCount: 0
    });
    await ctx.database.set("wifeUser", {
      userId: otherUserId,
      groupId: session.channelId.toString()
    }, {
      interactionWithOtherUser: targetWifeUser[0].interactionWithOtherUser
    });
  }
}
__name(createInteraction, "createInteraction");

// src/utils/readImageAsBinarySync.ts
var import_fs5 = __toESM(require("fs"));
async function readImageAsBinarySync(imagePath) {
  try {
    return import_fs5.default.readFileSync(imagePath);
  } catch (error) {
    throw new Error(`读取图片失败: ${error.message}`);
  }
}
__name(readImageAsBinarySync, "readImageAsBinarySync");

// src/utils/index.ts
var utils_default = {
  createUserData,
  createGroupData,
  createGroupWifeData,
  createTarget,
  checkGroupDate,
  affectionLevel,
  getRandomWavFile,
  createWifeData,
  upWifeData,
  sprit: sprit_default,
  createInteraction,
  readImageAsBinarySync,
  isSameDay
};

// src/command/clp.ts
function clp(ctx) {
  ctx.command("抽老婆 抽一个老婆").action(async ({ session }) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    await utils_default.createUserData(ctx, session);
    await utils_default.createGroupData(ctx, session);
    const userData = (await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }))[0];
    const groupData2 = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString()
    }))[0];
    const wifeName = await utils_default.checkGroupDate(
      ctx,
      session.channelId.toString(),
      /* @__PURE__ */ new Date(),
      session
    );
    if (wifeName) {
      ctx.database.set(
        "groupData",
        { groupId: session.channelId.toString() },
        {
          drawCount: groupData2.drawCount + 1
        }
      );
      await utils_default.createGroupWifeData(ctx, session, wifeName);
      const wifeData2 = (await ctx.database.get("wifeData", { name: wifeName }))[0];
      const groupWifeData = wifeData2.groupData.map((item) => {
        if (item.groupId === session.channelId.toString()) {
          item.drawCount += 1;
        }
        return item;
      });
      await ctx.database.set("wifeData", {
        name: wifeName
      }, {
        groupData: groupWifeData
      });
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          wifeName,
          drawCount: userData.drawCount + 1
        }
      );
      let found = false;
      userData.wifeHistories.forEach((item) => {
        if (item.wifeName === wifeName) {
          item.getNum += 1;
          item.isNtr = false;
          found = true;
        } else {
          item;
        }
      });
      if (!found) {
        userData.wifeHistories.push({
          wifeName,
          getWifeDate: /* @__PURE__ */ new Date(),
          getNum: 1,
          isNtr: false,
          ntrGetCount: 0,
          exchangeGetCount: 0,
          divorceCount: 0,
          affection: 0,
          affectionLevel: 0
        });
      }
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          wifeHistories: userData.wifeHistories
        }
      );
      const wifeImage = (await ctx.database.get("wifeData", { name: wifeName }))[0].filepath;
      const comeFrom = (await ctx.database.get("wifeData", { name: wifeName }))[0].comeFrom;
      if (found) {
        const imageBuffer = await utils_default.readImageAsBinarySync(wifeImage);
        session.send([
          (0, import_koishi.h)("quote", { id: session.messageId }),
          `重复了。
你今天抽到的老婆是:${wifeName}${comeFrom ? `
来自《${comeFrom}》` : ""}
上次抽到她的时间是${userData.wifeHistories.find((item) => item.wifeName === wifeName)?.getWifeDate.toLocaleString().split("T")[0]}`,
          import_koishi.h.image(imageBuffer, "image/png")
        ]);
      } else {
        const imageBuffer = await utils_default.readImageAsBinarySync(wifeImage);
        session.send([
          (0, import_koishi.h)("quote", { id: session.messageId }),
          `出新了！
你今天抽到的老婆是:${wifeName}${comeFrom ? `
来自《${comeFrom}》` : ""}`,
          import_koishi.h.image(imageBuffer, "image/png")
        ]);
      }
    } else {
      if (userData.wifeName) {
        const wifeImage = (await ctx.database.get("wifeData", { name: userData.wifeName }))[0].filepath;
        const comeFrom = (await ctx.database.get("wifeData", { name: userData.wifeName }))[0].comeFrom;
        const imageBuffer = await utils_default.readImageAsBinarySync(wifeImage);
        session.send([
          (0, import_koishi.h)("quote", { id: session.messageId }),
          `你的老婆是 ${userData.wifeName} ${comeFrom ? `，来自《${comeFrom}》` : ""}`,
          import_koishi.h.image(imageBuffer, "image/png")
        ]);
      } else {
        ctx.database.set(
          "groupData",
          { groupId: session.channelId.toString() },
          {
            drawCount: groupData2.drawCount + 1
          }
        );
        session.send([
          (0, import_koishi.h)("quote", { id: session.messageId }),
          "悲，老婆都被娶走了……"
        ]);
      }
    }
  });
}
__name(clp, "clp");

// src/command/nlp.ts
var import_koishi2 = require("koishi");
function nlp(ctx, config) {
  ctx.command("牛老婆 <userId> 牛指定群友老婆").action(async ({ session }, userId) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    if (!config.ntrSwitchgear) {
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        "牛老婆功能未开启，请联系管理员"
      ]);
      return;
    }
    if (config.ntrBlockGroup.includes(session.channelId.toString())) {
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        "本群牛老婆功能已被禁止，请联系管理员"
      ]);
      return;
    }
    userId = session.content.match(/<at id="(\d+)"\s*\/>/)?.[1];
    if (!userId) {
      session.send([(0, import_koishi2.h)("quote", { id: session.messageId }), "请@要牛的群友"]);
      return;
    }
    if (userId === session.userId) {
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        "自己牛自己，你真是个变态🤓"
      ]);
      return;
    }
    await utils_default.createTarget(ctx, session, userId);
    await utils_default.createUserData(ctx, session);
    await utils_default.createInteraction(ctx, session, userId);
    await utils_default.createGroupData(ctx, session);
    const myUserData = (await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }))[0];
    const targetUserData = (await ctx.database.get("wifeUser", {
      userId,
      groupId: session.channelId.toString()
    }))[0];
    const groupData2 = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString()
    }))[0];
    const wifeData2 = (await ctx.database.get("wifeData", { name: targetUserData.wifeName }))[0];
    if (!await utils_default.isSameDay(ctx, /* @__PURE__ */ new Date(), session)) {
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          operationDate: /* @__PURE__ */ new Date(),
          ntrCount: 0
        }
      );
    }
    if (myUserData.ntrCount >= config.ntrOrdinal && myUserData.ntrCount > 0) {
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        "你已经没有机会了"
      ]);
      return;
    }
    if (!targetUserData || !targetUserData?.wifeName) {
      session.send([(0, import_koishi2.h)("quote", { id: session.messageId }), "对方还没有老婆"]);
      return;
    }
    const targetWifeAffectionLevel = targetUserData.wifeHistories.find(
      (item) => item.wifeName === targetUserData.wifeName
    )?.affectionLevel;
    ctx.database.set(
      "wifeUser",
      { userId: session.userId, groupId: session.channelId.toString() },
      {
        ntrCount: myUserData.ntrCount + 1,
        ntrTotalCount: myUserData.ntrTotalCount + 1
      }
    );
    ctx.database.set(
      "wifeUser",
      { userId: session.userId, groupId: session.channelId.toString() },
      {
        interactionWithOtherUser: myUserData.interactionWithOtherUser.map(
          (item) => {
            if (item.otherUserId === userId && item.groupId === session.channelId.toString()) {
              item.ntrCount += 1;
            }
            return item;
          }
        )
      }
    );
    ctx.database.set(
      "wifeUser",
      { userId, groupId: session.channelId.toString() },
      {
        targetNtrCount: targetUserData.targetNtrCount + 1
      }
    );
    ctx.database.set(
      "groupData",
      { groupId: session.channelId.toString() },
      {
        ntrTotalCount: groupData2.ntrTotalCount + 1
      }
    );
    await utils_default.createGroupWifeData(ctx, session, targetUserData.wifeName);
    const groupWifeData = wifeData2.groupData.map((item) => {
      if (item.groupId === session.channelId.toString()) {
        item.ntrCount += 1;
      }
      return item;
    });
    await ctx.database.set(
      "wifeData",
      {
        name: targetUserData.wifeName
      },
      {
        groupData: groupWifeData
      }
    );
    const randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber < config.probabilityMath - targetWifeAffectionLevel * 10) {
      let found = false;
      myUserData.wifeHistories.forEach((item) => {
        if (item.wifeName === targetUserData.wifeName) {
          item.ntrGetCount += 1;
          found = true;
        } else {
          item;
        }
      });
      if (!found) {
        myUserData.wifeHistories.push({
          wifeName: targetUserData.wifeName,
          getWifeDate: /* @__PURE__ */ new Date(),
          getNum: 0,
          isNtr: true,
          ntrGetCount: 1,
          exchangeGetCount: 0,
          divorceCount: 0,
          affection: 0,
          affectionLevel: 0
        });
      }
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          wifeName: targetUserData.wifeName,
          ntrSuccessCount: myUserData.ntrSuccessCount + 1,
          wifeHistories: myUserData.wifeHistories
        }
      );
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          interactionWithOtherUser: myUserData.interactionWithOtherUser.map(
            (item) => {
              if (item.otherUserId === userId && item.groupId === session.channelId.toString()) {
                item.ntrSuccessCount += 1;
              }
              return item;
            }
          )
        }
      );
      ctx.database.set(
        "wifeUser",
        { userId, groupId: session.channelId.toString() },
        {
          wifeName: "",
          targetNtrCount: targetUserData.targetNtrCount + 1,
          targetNtrSuccessCount: targetUserData.targetNtrSuccessCount + 1,
          ntrCount: targetUserData.ntrCount - 1
        }
      );
      ctx.database.set(
        "groupData",
        { groupId: session.channelId.toString() },
        {
          ntrSuccessCount: groupData2.ntrSuccessCount + 1
        }
      );
      const groupWifeData2 = wifeData2.groupData.map((item) => {
        if (item.groupId === session.channelId.toString()) {
          item.ntrFailCount += 1;
        }
        return item;
      });
      await ctx.database.set(
        "wifeData",
        {
          name: targetUserData.wifeName
        },
        {
          groupData: groupWifeData2
        }
      );
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        `你的阴谋得逞了!
${(await session.bot.getUser(userId)).name}的老婆（${targetUserData.wifeName}）是你的了🥵
当前成功率：${config.probabilityMath - targetWifeAffectionLevel * 10}%`
      ]);
    } else {
      session.send([
        (0, import_koishi2.h)("quote", { id: session.messageId }),
        `你的阴谋失败了，黄毛被干掉了
你还有${config.ntrOrdinal - myUserData.ntrCount - 1}次机会
当前成功率：${config.probabilityMath}%`
      ]);
    }
  });
}
__name(nlp, "nlp");

// src/command/chalp.ts
var import_koishi3 = require("koishi");
var import_url = require("url");
function chalp(ctx) {
  ctx.command("查老婆 [userId] 查看个人老婆或指定群友老婆").action(async ({ session }, userId) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    if (userId) {
      await utils_default.createTarget(ctx, session, userId?.match(/<at id="(\d+)"\s*\/>/)?.[1]);
      const targetData = (await ctx.database.get("wifeUser", {
        userId: userId?.match(/<at id="(\d+)"\s*\/>/)?.[1],
        groupId: session.channelId.toString()
      }))[0];
      if (targetData.wifeName === "") {
        session.send([
          (0, import_koishi3.h)("quote", { id: session.messageId }),
          `对方还没有老婆`
        ]);
      } else {
        const imageBuffer = await utils_default.readImageAsBinarySync((await ctx.database.get("wifeData", { name: targetData.wifeName }))[0].filepath);
        session.send([
          (0, import_koishi3.h)("quote", { id: session.messageId }),
          `对方的老婆是 ${targetData.wifeName} ${(await ctx.database.get("wifeData", { name: targetData.wifeName }))[0].comeFrom ? `，来自《${(await ctx.database.get("wifeData", { name: targetData.wifeName }))[0].comeFrom}》` : ""}`,
          import_koishi3.h.image(imageBuffer, "image/png")
        ]);
      }
    } else {
      await utils_default.createUserData(ctx, session);
      const userData = (await ctx.database.get("wifeUser", {
        userId: session.userId,
        groupId: session.channelId.toString()
      }))[0];
      if (userData.wifeName) {
        const wifeImage = (await ctx.database.get("wifeData", { name: userData.wifeName }))[0].filepath;
        const comeFrom = (await ctx.database.get("wifeData", { name: userData.wifeName }))[0].comeFrom;
        session.send([
          (0, import_koishi3.h)("quote", { id: session.messageId }),
          `你的老婆是 ${userData.wifeName} ${comeFrom ? `，来自《${comeFrom}》` : ""}`,
          import_koishi3.h.image((0, import_url.pathToFileURL)(wifeImage).href)
        ]);
        return;
      } else {
        session.send([
          (0, import_koishi3.h)("quote", { id: session.messageId }),
          `你还没有老婆，快去抽一个吧`
        ]);
      }
    }
  });
}
__name(chalp, "chalp");

// src/command/lptj.ts
var import_koishi4 = require("koishi");
function lptj(ctx, config) {
  ctx.command("老婆图鉴 [targetUserId] 查看老婆图鉴").action(async ({ session }, targetUserId) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    let userId = session.userId;
    if (targetUserId) {
      userId = targetUserId.match(/<at id="(\d+)"\s*\/>/)?.[1];
    }
    await utils_default.createUserData(ctx, session);
    if (targetUserId) {
      await utils_default.createTarget(ctx, session, userId);
    }
    const lpAllNum = (await ctx.database.get("wifeData", {})).length;
    if (config.illustratedBook) {
      const lpList = (await ctx.database.get("wifeUser", {
        groupId: session.channelId.toString(),
        userId
      }))[0].wifeHistories.map((item) => item.wifeName);
      const imageBuffer = await sprit_default.generateMixedBackgroundImage(ctx, config, lpList);
      session.send([
        (0, import_koishi4.h)("quote", { id: session.messageId }),
        `你的老婆图鉴已出炉~`,
        import_koishi4.h.image(imageBuffer, "png"),
        `老婆收集进度：${lpList.length}/${lpAllNum}`
      ]);
    } else {
      const lpList = (await ctx.database.get("wifeUser", {
        groupId: session.channelId.toString(),
        userId
      }))[0].wifeHistories.filter((item) => !item.isNtr).map((item) => item.wifeName);
      const imageBuffer = await sprit_default.generateMixedBackgroundImage(ctx, config, lpList);
      session.send([
        (0, import_koishi4.h)("quote", { id: session.messageId }),
        "你的老婆图鉴已出炉~",
        import_koishi4.h.image(imageBuffer, "png"),
        `老婆收集进度：${lpList.length}/${lpAllNum}`
      ]);
    }
  });
}
__name(lptj, "lptj");

// src/command/lh.ts
var import_koishi5 = require("koishi");
function lh(ctx, config) {
  ctx.command("离婚 解除婚姻关系").action(async ({ session }) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    if (!config.divorceSwitchgear) {
      session.send([(0, import_koishi5.h)("quote", { id: session.messageId }), "离婚功能未开启，请联系管理员"]);
      return;
    }
    if (config.divorceBlockGroup.includes(session.channelId.toString())) {
      session.send([(0, import_koishi5.h)("quote", { id: session.messageId }), "本群离婚功能已被禁止，请联系管理员"]);
      return;
    }
    await utils_default.createUserData(ctx, session);
    await utils_default.createGroupData(ctx, session);
    const groupData2 = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString()
    }))[0];
    const userData = (await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }))[0];
    if (!await utils_default.isSameDay(ctx, /* @__PURE__ */ new Date(), session)) {
      ctx.database.set("wifeUser", { userId: session.userId, groupId: session.channelId.toString() }, {
        operationDate: /* @__PURE__ */ new Date(),
        divorceCount: 0
      });
    }
    if (!userData?.wifeName) {
      session.send([(0, import_koishi5.h)("quote", { id: session.messageId }), "你还没有老婆"]);
      return;
    }
    const wifeData2 = (await ctx.database.get("wifeData", {
      name: userData.wifeName
    }))[0];
    if (userData.divorceCount >= config.divorceLimit && userData.divorceCount > 0) {
      session.send(`你已经离婚${config.divorceLimit}次了，你这个渣男`);
      return;
    }
    ctx.database.set(
      "wifeUser",
      { userId: session.userId, groupId: session.channelId.toString() },
      {
        divorceCount: userData.divorceCount + 1,
        wifeName: "",
        wifeHistories: userData.wifeHistories.map((item) => {
          if (item.wifeName === userData.wifeName) {
            item.affection -= 1;
          }
          return item;
        })
      }
    );
    ctx.database.set(
      "groupData",
      { groupId: session.channelId.toString() },
      {
        divorceTotalCount: groupData2.divorceTotalCount + 1
      }
    );
    await utils_default.createGroupWifeData(ctx, session, userData.wifeName);
    const groupWifeData = wifeData2.groupData.map((item) => {
      if (item.groupId === session.channelId.toString()) {
        item.divorceCount += 1;
      }
      return item;
    });
    await ctx.database.set("wifeData", {
      name: userData.wifeName
    }, {
      groupData: groupWifeData
    });
    session.send([
      (0, import_koishi5.h)("quote", { id: session.messageId }),
      `你和${userData.wifeName}离婚了
${userData.wifeName}对你的好感度 -1`
    ]);
  });
}
__name(lh, "lh");

// src/command/jhlp.ts
var import_koishi6 = require("koishi");
async function exchangeWife(ctx, session, myId, userId) {
  let userData = (await ctx.database.get("wifeUser", {
    userId: myId,
    groupId: session.channelId.toString()
  }))[0];
  let targetUserData = (await ctx.database.get("wifeUser", {
    userId,
    groupId: session.channelId.toString()
  }))[0];
  const groupData2 = (await ctx.database.get("groupData", {
    groupId: session.channelId.toString()
  }))[0];
  const myWifeName = userData.wifeName;
  const targetWifeName = targetUserData.wifeName;
  ctx.database.set(
    "groupData",
    {
      groupId: session.channelId.toString()
    },
    {
      exchangeCount: groupData2.exchangeCount + 1
    }
  );
  let found = false;
  userData.wifeHistories.forEach((item) => {
    if (item.wifeName === targetWifeName) {
      item.getNum += 1;
      item.isNtr = false;
      found = true;
    } else {
      item;
    }
  });
  if (!found) {
    userData.wifeHistories.push({
      wifeName: targetWifeName,
      getWifeDate: /* @__PURE__ */ new Date(),
      getNum: 1,
      isNtr: false,
      ntrGetCount: 0,
      exchangeGetCount: 0,
      divorceCount: 0,
      affection: 0,
      affectionLevel: 0
    });
  }
  ctx.database.set(
    "wifeUser",
    { userId: myId, groupId: session.channelId.toString() },
    {
      wifeHistories: userData.wifeHistories,
      wifeName: targetWifeName,
      exchangeCount: userData.exchangeCount + 1
    }
  );
  found = false;
  targetUserData.wifeHistories.forEach((item) => {
    if (item.wifeName === myWifeName) {
      item.getNum += 1;
      item.isNtr = false;
      found = true;
    } else {
      item;
    }
  });
  if (!found) {
    targetUserData.wifeHistories.push({
      wifeName: myWifeName,
      getWifeDate: /* @__PURE__ */ new Date(),
      getNum: 1,
      isNtr: false,
      ntrGetCount: 0,
      exchangeGetCount: 0,
      divorceCount: 0,
      affection: 0,
      affectionLevel: 0
    });
  }
  ctx.database.set(
    "wifeUser",
    { userId, groupId: session.channelId.toString() },
    {
      wifeHistories: targetUserData.wifeHistories,
      wifeName: myWifeName,
      exchangeCount: targetUserData.exchangeCount + 1
    }
  );
  ctx.database.set("wifeUser", { userId: myId, groupId: session.channelId.toString() }, {
    interactionWithOtherUser: userData.interactionWithOtherUser.map((item) => {
      if (item.otherUserId === userId && item.groupId === session.channelId.toString()) {
        item.exchangeCount += 1;
      }
      return item;
    })
  });
  ctx.database.set("wifeUser", { userId, groupId: session.channelId.toString() }, {
    interactionWithOtherUser: targetUserData.interactionWithOtherUser.map((item) => {
      if (item.otherUserId === myId && item.groupId === session.channelId.toString()) {
        item.exchangeCount += 1;
      }
      return item;
    })
  });
}
__name(exchangeWife, "exchangeWife");
function jhlp(ctx) {
  ctx.command("交换老婆 <userId> 和指定群友交换老婆").action(async ({ session }, userId) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    userId = session.content.match(/<at id="(\d+)"\s*\/>/)?.[1];
    const myId = session.userId;
    await utils_default.createUserData(ctx, session);
    await utils_default.createInteraction(ctx, session, userId);
    await utils_default.createGroupData(ctx, session);
    await utils_default.createTarget(ctx, session, userId);
    const messageId = session.messageId;
    if (!userId) {
      session.send([(0, import_koishi6.h)("quote", { id: messageId }), "请@要交换的群友"]);
      return;
    }
    let userData = (await ctx.database.get("wifeUser", {
      userId: myId,
      groupId: session.channelId.toString()
    }))[0];
    let targetUserData = (await ctx.database.get("wifeUser", {
      userId,
      groupId: session.channelId.toString()
    }))[0];
    if (userData.wifeName === "") {
      session.send([(0, import_koishi6.h)("quote", { id: messageId }), "你还没有老婆，不能发起交换请求"]);
      return;
    }
    if (targetUserData.wifeName === "") {
      session.send([(0, import_koishi6.h)("quote", { id: messageId }), "对方还没有老婆，不能发起交换请求"]);
      return;
    }
    session.send([
      (0, import_koishi6.h)("at", { id: userId }),
      `${session.author.name} 想和你交换老婆，请在30秒内回复“同意”或“拒绝”`
    ]);
    const message = ctx.on("message", async (session2) => {
      if (session2.content === "同意" && session2.userId === userId) {
        await exchangeWife(ctx, session2, myId, userId);
        message();
        clearTimeout(timer);
        session2.send([(0, import_koishi6.h)("quote", { id: messageId }), "对方同意了你的交换请求"]);
      } else if (session2.content === "拒绝" && session2.userId === userId) {
        session2.send([(0, import_koishi6.h)("quote", { id: messageId }), "对方拒绝了你的交换请求"]);
        message();
        clearTimeout(timer);
      }
    });
    const timer = setTimeout(() => {
      message();
      clearTimeout(timer);
      session.send([(0, import_koishi6.h)("quote", { id: messageId }), "对方没有回复，请求已失效"]);
    }, 3e4);
  });
}
__name(jhlp, "jhlp");

// src/command/rlp.ts
var import_koishi7 = require("koishi");
var import_path5 = __toESM(require("path"));
var import_url2 = require("url");
function rlp(ctx, config) {
  let wifegachaPath4 = "";
  if (import_path5.default.join(__dirname).split("\\").pop() == "command") {
    wifegachaPath4 = import_path5.default.join(
      __dirname,
      "../",
      "wifeVoice"
    );
  } else {
    wifegachaPath4 = import_path5.default.join(
      __dirname,
      "wifeVoice"
    );
  }
  ctx.command("日老婆 增加老婆好感度").action(async ({ session }) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    if (!config.fuckWifeSwitchgear) {
      session.send([(0, import_koishi7.h)("quote", { id: session.messageId }), "日老婆功能未开启，请联系管理员"]);
      return;
    }
    if (config.fuckWifeBlockGroup.includes(session.channelId.toString())) {
      session.send([(0, import_koishi7.h)("quote", { id: session.messageId }), "本群日老婆功能已被禁止，请联系管理员"]);
      return;
    }
    await utils_default.createUserData(ctx, session);
    await utils_default.createGroupData(ctx, session);
    const userData = (await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }))[0];
    const groupData2 = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString()
    }))[0];
    const wifeData2 = (await ctx.database.get("wifeData", {
      name: userData.wifeName
    }))[0];
    const wifeName = userData.wifeName;
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let affection = 0;
    let audioUrl = "";
    if (randomNumber <= 5) {
      affection = -2;
      audioUrl = getRandomWavFile(import_path5.default.join(wifegachaPath4, "-2"));
      if (!audioUrl) {
        return;
      }
      audioUrl = import_path5.default.join(wifegachaPath4, "-2", audioUrl);
    } else if (randomNumber <= 15) {
      affection = -1;
      audioUrl = getRandomWavFile(import_path5.default.join(wifegachaPath4, "-1"));
      if (!audioUrl) {
        return;
      }
      audioUrl = import_path5.default.join(wifegachaPath4, "-1", audioUrl);
    } else if (randomNumber <= 30) {
      affection = 3;
      audioUrl = getRandomWavFile(import_path5.default.join(wifegachaPath4, "+3"));
      if (!audioUrl) {
        return;
      }
      audioUrl = import_path5.default.join(wifegachaPath4, "+3", audioUrl);
    } else if (randomNumber <= 55) {
      affection = 2;
      audioUrl = getRandomWavFile(import_path5.default.join(wifegachaPath4, "+2"));
      if (!audioUrl) {
        return;
      }
      audioUrl = import_path5.default.join(wifegachaPath4, "+2", audioUrl);
    } else {
      affection = 1;
      audioUrl = getRandomWavFile(import_path5.default.join(wifegachaPath4, "+1"));
      if (!audioUrl) {
        return;
      }
      audioUrl = import_path5.default.join(wifegachaPath4, "+1", audioUrl);
    }
    if (wifeName) {
      const fuckWifeDate = userData.fuckWifeDate;
      if (!fuckWifeDate) {
        userData.fuckWifeDate = /* @__PURE__ */ new Date();
        userData.wifeHistories.forEach((item) => {
          if (item.wifeName === wifeName) {
            item.affection = item.affection + affection;
            item.affectionLevel = utils_default.affectionLevel(item.affection);
          }
        });
        ctx.database.set("wifeUser", {
          userId: session.userId,
          groupId: session.channelId.toString()
        }, {
          wifeHistories: userData.wifeHistories,
          fuckWifeDate: userData.fuckWifeDate
        });
        ctx.database.set("groupData", {
          groupId: session.channelId.toString()
        }, {
          fuckTotalCount: groupData2.fuckTotalCount + 1
        });
        await utils_default.createGroupWifeData(ctx, session, wifeName);
        const groupWifeData = wifeData2.groupData.map((item) => {
          if (item.groupId === session.channelId.toString()) {
            item.fuckCount += 1;
          }
          return item;
        });
        await ctx.database.set("wifeData", {
          name: wifeName
        }, {
          groupData: groupWifeData
        });
        session.send([
          (0, import_koishi7.h)("quote", { id: session.messageId }),
          `${userData.wifeName}好感度${affection > 0 ? "+" : ""}${affection}
${config.fuckWifeDetailedReply ? `当前好感度：${userData.wifeHistories.find((item) => item.wifeName === wifeName)?.affection}
当前好感等级：${userData.wifeHistories.find((item) => item.wifeName === wifeName)?.affectionLevel}
每级好感度都会降低10%被牛走概率` : ""}`,
          audioUrl && config.fuckWifeVoiceReply ? import_koishi7.h.audio((0, import_url2.pathToFileURL)(import_path5.default.resolve(audioUrl)).href) : ""
        ]);
      } else {
        const now = (/* @__PURE__ */ new Date()).getTime();
        const diffTime = Math.abs(now - fuckWifeDate.getTime());
        const diffSeconds = Math.floor(diffTime / 1e3);
        if (diffSeconds > config.fuckWifeCoolingTime) {
          userData.fuckWifeDate = /* @__PURE__ */ new Date();
          userData.wifeHistories.forEach((item) => {
            if (item.wifeName === wifeName) {
              item.affection = item.affection + affection;
              item.affectionLevel = utils_default.affectionLevel(item.affection);
            }
          });
          ctx.database.set("wifeUser", {
            userId: session.userId,
            groupId: session.channelId.toString()
          }, {
            wifeHistories: userData.wifeHistories,
            fuckWifeDate: userData.fuckWifeDate
          });
          ctx.database.set("groupData", {
            groupId: session.channelId.toString()
          }, {
            fuckTotalCount: groupData2.fuckTotalCount + 1
          });
          await utils_default.createGroupWifeData(ctx, session, wifeName);
          const groupWifeData = wifeData2.groupData.map((item) => {
            if (item.groupId === session.channelId.toString()) {
              item.fuckCount += 1;
            }
            return item;
          });
          await ctx.database.set("wifeData", {
            name: wifeName
          }, {
            groupData: groupWifeData
          });
          session.send([
            (0, import_koishi7.h)("quote", { id: session.messageId }),
            `${userData.wifeName}好感度${affection > 0 ? "+" : ""}${affection}
${config.fuckWifeDetailedReply ? `当前好感度：${userData.wifeHistories.find((item) => item.wifeName === wifeName)?.affection}
当前好感等级：${userData.wifeHistories.find((item) => item.wifeName === wifeName)?.affectionLevel}
每级好感度都会降低10%被牛走概率` : ""}`,
            audioUrl && config.fuckWifeVoiceReply ? import_koishi7.h.audio((0, import_url2.pathToFileURL)(import_path5.default.resolve(audioUrl)).href) : ""
          ]);
        } else {
          const minutes = Math.floor((config.fuckWifeCoolingTime - diffSeconds) / 60);
          const seconds = (config.fuckWifeCoolingTime - diffSeconds) % 60;
          session.send([(0, import_koishi7.h)("quote", { id: session.messageId }), `日老婆冷却中，${minutes}分${seconds}秒后可以再次日老婆`]);
        }
      }
    } else {
      session.send([(0, import_koishi7.h)("quote", { id: session.messageId }), "你还没有老婆"]);
    }
  });
}
__name(rlp, "rlp");

// src/command/tjlp.ts
var import_koishi8 = require("koishi");
var import_fs6 = require("fs");
var import_path6 = __toESM(require("path"));
function tjlp(ctx, config) {
  let wifegachaPath4 = "";
  if (import_path6.default.join(__dirname).split("\\").pop() == "command") {
    wifegachaPath4 = import_path6.default.join(
      __dirname,
      "../../../..",
      "data/assets/wifegacha"
    );
  } else {
    wifegachaPath4 = import_path6.default.join(
      __dirname,
      "../../..",
      "data/assets/wifegacha"
    );
  }
  ctx.command("添加老婆 <name> <image> 添加老婆信息").action(async ({ session }, name2, image) => {
    ctx.logger.info(import_path6.default.join(__dirname));
    if (!config.wifeUploadGroup.includes(session.userId.toString()) && !config.wifeAllOperationGroup.includes(session.userId.toString()) && session.userId !== config.adminId) {
      return [(0, import_koishi8.h)("quote", { id: session.messageId }), "你无权添加老婆"];
    }
    if (!name2 || !image)
      return [(0, import_koishi8.h)("quote", { id: session.messageId }), "缺少参数"];
    if (name2.split(config.wifeNameSeparator).length < 2) {
      return [(0, import_koishi8.h)("quote", { id: session.messageId }), "老婆名称格式错误,请使用" + config.wifeNameSeparator + "分隔来源和名称"];
    }
    if (!image.includes("<img src=")) {
      return [(0, import_koishi8.h)("quote", { id: session.messageId }), "未检测到图片"];
    }
    const wifeNameList = (await ctx.database.get("wifeData", {})).map((item) => item.name);
    if (wifeNameList.includes(name2.split(config.wifeNameSeparator)[1])) {
      return [(0, import_koishi8.h)("quote", { id: session.messageId }), "该老婆已存在，请使用更新老婆命令"];
    }
    const wifeImageData = await ctx.http.get(
      image.match(/<img\s+src="([^"]+)"/)?.[1].replaceAll("&amp;", "&")
    );
    const buffer = Buffer.from(wifeImageData);
    (0, import_fs6.writeFileSync)(import_path6.default.join(wifegachaPath4, `${name2}.png`), buffer);
    await ctx.database.create("wifeData", {
      name: name2.split(config.wifeNameSeparator)[1],
      comeFrom: name2.split(config.wifeNameSeparator)[0],
      filepath: import_path6.default.join(wifegachaPath4, `${name2}.png`),
      createdAt: /* @__PURE__ */ new Date(),
      groupData: []
    });
    const imageBuffer = await utils_default.readImageAsBinarySync(import_path6.default.join(wifegachaPath4, `${name2}.png`));
    session.send([
      (0, import_koishi8.h)("quote", { id: session.messageId }),
      "老婆添加成功",
      import_koishi8.h.image(imageBuffer, "image/png")
    ]);
  });
}
__name(tjlp, "tjlp");

// src/command/sclp.ts
var import_koishi9 = require("koishi");
var import_fs7 = require("fs");
var import_path7 = __toESM(require("path"));
function sclp(ctx, config) {
  ctx.command("删除老婆 <name> 删除老婆信息").action(async ({ session }, name2) => {
    if (!config.wifeDeleteGroup.includes(session.userId.toString()) && !config.wifeAllOperationGroup.includes(session.userId.toString()) && session.userId !== config.adminId) {
      return [(0, import_koishi9.h)("quote", { id: session.messageId }), "你无权删除老婆"];
    }
    if (!name2)
      return [(0, import_koishi9.h)("quote", { id: session.messageId }), "请输入要删除的老婆名称"];
    const wifeNameList = (await ctx.database.get("wifeData", {})).map((item) => item.name);
    if (!wifeNameList.includes(name2)) {
      return [(0, import_koishi9.h)("quote", { id: session.messageId }), "该老婆不存在，请使用添加老婆命令"];
    }
    const wifeData2 = await ctx.database.get("wifeData", {
      name: name2
    });
    const wifeFilePath = import_path7.default.join(wifeData2[0].filepath);
    (0, import_fs7.unlinkSync)(wifeFilePath);
    await ctx.database.remove("wifeData", {
      name: name2
    });
    const userData = await ctx.database.get("wifeUser", {
      userId: session.userId
    });
    const userWifeHistories = userData[0].wifeHistories.filter((item) => item.wifeName !== name2);
    await ctx.database.set("wifeUser", {
      userId: session.userId
    }, {
      wifeHistories: userWifeHistories
    });
    if (userData[0].wifeName === name2) {
      await ctx.database.set("wifeUser", {
        userId: session.userId
      }, {
        wifeName: ""
      });
    }
    session.send([
      (0, import_koishi9.h)("quote", { id: session.messageId }),
      "老婆删除成功"
    ]);
  });
}
__name(sclp, "sclp");

// src/command/gxlp.ts
var import_koishi10 = require("koishi");
var import_fs8 = require("fs");
var import_path8 = __toESM(require("path"));
function gxlp(ctx, config) {
  let wifegachaPath4 = "";
  if (import_path8.default.join(__dirname).split("\\").pop() == "command") {
    wifegachaPath4 = import_path8.default.join(
      __dirname,
      "../../../..",
      "data/assets/wifegacha"
    );
  } else {
    wifegachaPath4 = import_path8.default.join(
      __dirname,
      "../../..",
      "data/assets/wifegacha"
    );
  }
  ctx.command("更新老婆 <name> <image> 更新老婆信息").action(async ({ session }, name2, image) => {
    if (!config.wifeUpdateGroup.includes(session.userId.toString()) && !config.wifeAllOperationGroup.includes(session.userId.toString()) && session.userId !== config.adminId) {
      return [(0, import_koishi10.h)("quote", { id: session.messageId }), "你无权更新老婆"];
    }
    if (!name2 || !image)
      return [(0, import_koishi10.h)("quote", { id: session.messageId }), "缺少参数"];
    if (!image.includes("<img src=")) {
      return [(0, import_koishi10.h)("quote", { id: session.messageId }), "未检测到图片"];
    }
    const wifeData2 = await ctx.database.get("wifeData", { name: name2 });
    if (wifeData2.length === 0) {
      return [(0, import_koishi10.h)("quote", { id: session.messageId }), "该老婆不存在，请使用添加老婆命令"];
    }
    const wifeImageData = await ctx.http.get(
      image.match(/<img\s+src="([^"]+)"/)?.[1].replaceAll("&amp;", "&")
    );
    const wifeComeFrom = wifeData2[0].comeFrom;
    const buffer = Buffer.from(wifeImageData);
    (0, import_fs8.unlinkSync)(wifeData2[0].filepath);
    (0, import_fs8.writeFileSync)(import_path8.default.join(wifegachaPath4, `${wifeComeFrom ? wifeComeFrom + config.wifeNameSeparator : ""}${name2}.png`), buffer);
    await ctx.database.set("wifeData", {
      name: name2
    }, {
      comeFrom: wifeComeFrom,
      filepath: import_path8.default.join(wifegachaPath4, `${wifeComeFrom ? wifeComeFrom + config.wifeNameSeparator : ""}${name2}.png`)
    });
    const imageBuffer = await utils_default.readImageAsBinarySync(import_path8.default.join(wifegachaPath4, `${wifeComeFrom ? wifeComeFrom + config.wifeNameSeparator : ""}${name2}.png`));
    session.send([
      (0, import_koishi10.h)("quote", { id: session.messageId }),
      "老婆更新成功",
      import_koishi10.h.image(imageBuffer, "image/png")
    ]);
  });
}
__name(gxlp, "gxlp");

// src/command/lpda.ts
var import_koishi11 = require("koishi");
function lpda(ctx, config) {
  ctx.command("老婆档案 [wifeName] 查询老婆档案").action(async ({ session }, wifeName) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    let divorceSwitchgear = true;
    if (!config.divorceSwitchgear) {
      divorceSwitchgear = false;
    }
    if (config.divorceBlockGroup.includes(session.channelId.toString())) {
      divorceSwitchgear = false;
    }
    let fuckWifeSwitchgear = true;
    if (!config.fuckWifeSwitchgear) {
      fuckWifeSwitchgear = false;
    }
    if (config.fuckWifeBlockGroup.includes(session.channelId.toString())) {
      fuckWifeSwitchgear = false;
    }
    let ntrSwitchgear = true;
    if (!config.ntrSwitchgear) {
      ntrSwitchgear = false;
    }
    if (config.ntrBlockGroup.includes(session.channelId.toString())) {
      ntrSwitchgear = false;
    }
    await utils_default.createUserData(ctx, session);
    const wifeData2 = await ctx.database.get("wifeData", {});
    const wifeUser2 = await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    });
    if (wifeName) {
      if (!wifeData2.find((item) => item.name === wifeName)) {
        const possibleWife = wifeData2.filter(
          (item) => item.name.includes(wifeName)
        );
        if (possibleWife.length > 0) {
          session.send([
            (0, import_koishi11.h)("quote", { id: session.messageId }),
            "你可能是想找：\n",
            possibleWife.map((item) => item.name).join("\n")
          ]);
        } else {
          session.send([(0, import_koishi11.h)("quote", { id: session.messageId }), "老婆不存在"]);
        }
      } else {
        const now = (/* @__PURE__ */ new Date()).getTime();
        const diffTime = Math.abs(now - wifeUser2[0].lpdaDate.getTime());
        const diffSeconds = Math.floor(diffTime / 1e3);
        if (diffSeconds < config.lpdaDateInterval) {
          const minutes = Math.floor(
            (config.lpdaDateInterval - diffSeconds) / 60
          );
          const seconds = (config.lpdaDateInterval - diffSeconds) % 60;
          session.send([
            (0, import_koishi11.h)("quote", { id: session.messageId }),
            `档案查询冷却中，${minutes}分${seconds}秒后可以再次查询`
          ]);
          return;
        }
        await ctx.database.set(
          "wifeUser",
          {
            userId: session.userId,
            groupId: session.channelId.toString()
          },
          {
            lpdaDate: /* @__PURE__ */ new Date()
          }
        );
        const wife = wifeData2.find((item) => item.name === wifeName);
        if (wife) {
          if (!wife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )) {
            wife.groupData.push({
              groupId: session.channelId.toString(),
              drawCount: 0,
              ntrCount: 0,
              fuckCount: 0,
              divorceCount: 0,
              ntrFailCount: 0
            });
            await ctx.database.set(
              "wifeData",
              {
                name: wife.name
              },
              {
                groupData: wife.groupData
              }
            );
          }
          if (wifeUser2[0].wifeHistories.find(
            (item) => item.wifeName === wifeName
          )) {
            const imageBuffer = await utils_default.readImageAsBinarySync(wife.filepath);
            session.send([
              (0, import_koishi11.h)("quote", { id: session.messageId }),
              `名字：${wife.name}
`,
              `${wife.comeFrom ? `来自：${wife.comeFrom}
` : ""}`,
              import_koishi11.h.image(imageBuffer, "image/png"),
              `${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 你们相遇的时间是：${wifeUser2[0].wifeHistories.find((item) => item.wifeName === wifeName)?.getWifeDate.toLocaleString().split("T")[0]}
` : ""}`,
              `${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 你一共抽到她${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.getNum}次
` : ""}`,
              `${ntrSwitchgear && wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 你一共牛到手${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.ntrGetCount}次
` : ""}`,
              `${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 你一共交换到手${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.exchangeGetCount}次
` : ""}`,
              `${divorceSwitchgear && wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 你一共离婚${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.divorceCount}次
` : ""}`,
              `${fuckWifeSwitchgear && wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 她对你的好感度：${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.affection}
` : ""}`,
              `${fuckWifeSwitchgear && wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              ) ? `- 她对你的好感等级：${wifeUser2[0].wifeHistories.find(
                (item) => item.wifeName === wifeName
              )?.affectionLevel}
` : ""}`,
              `-----------
`,
              `${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              ) ? `- 本群一共抽到${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.drawCount}次
` : ""}`,
              `${ntrSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              ) ? `- 本群一共被牛${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrCount}次
` : ""}`,
              `${fuckWifeSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.fuckCount ? `- 本群总好感度：${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.fuckCount}
` : ""}`,
              `${divorceSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.divorceCount ? `- 本群一共离婚${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.divorceCount}次
` : ""}`,
              `${ntrSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrFailCount ? `- 本群一共被牛走${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrFailCount}次
` : ""}`
            ]);
          } else {
            const imageBuffer = await utils_default.readImageAsBinarySync(wife.filepath);
            session.send([
              (0, import_koishi11.h)("quote", { id: session.messageId }),
              `名字：${wife.name}
`,
              `${wife.comeFrom ? `来自：${wife.comeFrom}
` : ""}`,
              import_koishi11.h.image(imageBuffer, "image/png"),
              `${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.drawCount ? `- 本群一共抽到${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.drawCount}次
` : ""}`,
              `${ntrSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrCount ? `- 本群一共被牛${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrCount}次
` : ""}`,
              `${fuckWifeSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.fuckCount ? `- 本群总好感度：${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.fuckCount}
` : ""}`,
              `${divorceSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.divorceCount ? `- 本群一共离婚${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.divorceCount}次
` : ""}`,
              `${ntrSwitchgear && wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrFailCount ? `- 本群一共被牛走${wife.groupData.find(
                (item) => item.groupId === session.channelId.toString()
              )?.ntrFailCount}次
` : ""}`
            ]);
          }
        }
      }
    } else {
      const now = (/* @__PURE__ */ new Date()).getTime();
      const diffTime = Math.abs(now - wifeUser2[0].lpdaDate.getTime());
      const diffSeconds = Math.floor(diffTime / 1e3);
      if (diffSeconds < config.lpdaDateInterval) {
        const minutes = Math.floor(
          (config.lpdaDateInterval - diffSeconds) / 60
        );
        const seconds = (config.lpdaDateInterval - diffSeconds) % 60;
        session.send([
          (0, import_koishi11.h)("quote", { id: session.messageId }),
          `档案查询冷却中，${minutes}分${seconds}秒后可以再次查询`
        ]);
        return;
      }
      await ctx.database.set(
        "wifeUser",
        {
          userId: session.userId,
          groupId: session.channelId.toString()
        },
        {
          lpdaDate: /* @__PURE__ */ new Date()
        }
      );
      const groupWifeData = wifeData2.filter(
        (item) => item.groupData.find(
          (item2) => item2.groupId === session.channelId.toString()
        )
      );
      if (groupWifeData.length > 0) {
        const mostDrawWife = groupWifeData.sort(
          (a, b) => b.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.drawCount - a.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.drawCount
        )[0];
        const mostNtrWife = groupWifeData.sort(
          (a, b) => b.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrCount - a.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrCount
        )[0];
        const mostFuckWife = groupWifeData.sort(
          (a, b) => b.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.fuckCount - a.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.fuckCount
        )[0];
        const mostDivorceWife = groupWifeData.sort(
          (a, b) => b.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.divorceCount - a.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.divorceCount
        )[0];
        const mostNtrFailWife = groupWifeData.sort(
          (a, b) => b.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrFailCount - a.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrFailCount
        )[0];
        session.send([
          (0, import_koishi11.h)("quote", { id: session.messageId }),
          "本群老婆统计：\n",
          `${mostDrawWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.drawCount ? `- 被娶最多的老婆：${mostDrawWife.name}，共${mostDrawWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.drawCount}次
` : ""}`,
          `${mostNtrWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrCount ? `- 被牛最多的老婆：${mostNtrWife.name}，共${mostNtrWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrCount}次
` : ""}`,
          `${mostFuckWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.fuckCount ? `- 好感度最高的老婆：${mostFuckWife.name}，共${mostFuckWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.fuckCount}次
` : ""}`,
          `${mostDivorceWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.divorceCount ? `- 离婚最多的老婆：${mostDivorceWife.name}，共${mostDivorceWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.divorceCount}次
` : ""}`,
          `${mostNtrFailWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrFailCount ? `- 被牛走最多的老婆：${mostNtrFailWife.name}，共${mostNtrFailWife.groupData.find(
            (item) => item.groupId === session.channelId.toString()
          )?.ntrFailCount}次
` : ""}`
        ]);
      } else {
        session.send([
          (0, import_koishi11.h)("quote", { id: session.messageId }),
          "本群没有老婆档案"
        ]);
      }
    }
  });
}
__name(lpda, "lpda");

// src/command/yhda.ts
var import_koishi12 = require("koishi");
function yhda(ctx, config) {
  ctx.command("用户档案 [userId] 查看用户档案").action(async ({ session }, userId) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    let divorceSwitchgear = true;
    if (!config.divorceSwitchgear) {
      divorceSwitchgear = false;
    }
    if (config.divorceBlockGroup.includes(session.channelId.toString())) {
      divorceSwitchgear = false;
    }
    let fuckWifeSwitchgear = true;
    if (!config.fuckWifeSwitchgear) {
      fuckWifeSwitchgear = false;
    }
    if (config.fuckWifeBlockGroup.includes(session.channelId.toString())) {
      fuckWifeSwitchgear = false;
    }
    let ntrSwitchgear = true;
    if (!config.ntrSwitchgear) {
      ntrSwitchgear = false;
    }
    if (config.ntrBlockGroup.includes(session.channelId.toString())) {
      ntrSwitchgear = false;
    }
    await utils_default.createUserData(ctx, session);
    await utils_default.createGroupData(ctx, session);
    const wifeUser2 = (await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString()
    }))[0];
    const groupData2 = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString()
    }))[0];
    const wifeDataNum = (await ctx.database.get("wifeData", {})).length;
    const now = (/* @__PURE__ */ new Date()).getTime();
    const diffTime = Math.abs(now - wifeUser2.lpdaDate.getTime());
    const diffSeconds = Math.floor(diffTime / 1e3);
    if (diffSeconds < config.lpdaDateInterval) {
      const minutes = Math.floor(
        (config.lpdaDateInterval - diffSeconds) / 60
      );
      const seconds = (config.lpdaDateInterval - diffSeconds) % 60;
      session.send([
        (0, import_koishi12.h)("quote", { id: session.messageId }),
        `档案查询冷却中，${minutes}分${seconds}秒后可以再次查询`
      ]);
      return;
    }
    await ctx.database.set(
      "wifeUser",
      {
        userId: session.userId,
        groupId: session.channelId.toString()
      },
      {
        lpdaDate: /* @__PURE__ */ new Date()
      }
    );
    if (userId) {
      userId = userId.match(/<at id="(\d+)"\s*\/>/)?.[1];
      await utils_default.createTarget(ctx, session, userId);
      const targetwifeUser = (await ctx.database.get("wifeUser", {
        userId,
        groupId: session.channelId.toString()
      }))[0];
      await utils_default.createInteraction(ctx, session, userId);
      const wifeHistoriesNum = targetwifeUser.wifeHistories.length;
      const drawCount = targetwifeUser.drawCount;
      const ntrTotalCount = targetwifeUser.ntrTotalCount;
      const ntrSuccessCount = targetwifeUser.ntrSuccessCount;
      const divorceCount = targetwifeUser.divorceCount;
      const exchangeCount = targetwifeUser.exchangeCount;
      const totalAffection = targetwifeUser.totalAffection;
      const targetNtrCount = targetwifeUser.targetNtrCount;
      const targetNtrSuccessCount = targetwifeUser.targetNtrSuccessCount;
      const interactionWithOtherUser = targetwifeUser.interactionWithOtherUser;
      let interactionFlag = false;
      let maxNtrCountUser = "";
      let maxNtrCount = 0;
      let maxNtrSuccessCountUser = "";
      let maxNtrSuccessCount = 0;
      let maxExchangeCountUser = "";
      let maxExchangeCount = 0;
      if (interactionWithOtherUser.length > 0) {
        interactionFlag = true;
        for (const item of interactionWithOtherUser) {
          if (item.ntrCount > maxNtrCount) {
            maxNtrCount = item.ntrCount;
            maxNtrCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
          if (item.ntrSuccessCount >= maxNtrSuccessCount) {
            maxNtrSuccessCount = item.ntrSuccessCount;
            maxNtrSuccessCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
          if (item.exchangeCount >= maxExchangeCount) {
            maxExchangeCount = item.exchangeCount;
            maxExchangeCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
        }
      }
      session.send([
        (0, import_koishi12.h)("quote", { id: session.messageId }),
        `- 目标用户档案：
`,
        `- 老婆收集进度：${wifeHistoriesNum}/${wifeDataNum}
`,
        `${drawCount ? `- 抽老婆次数：${drawCount}
` : ""}`,
        `${ntrSwitchgear && ntrTotalCount ? `- 牛老婆总次数：${ntrTotalCount}
` : ""}`,
        `${ntrSwitchgear && ntrSuccessCount ? `- 牛老婆成功次数：${ntrSuccessCount}
` : ""}`,
        `${ntrSwitchgear && ntrTotalCount ? `- 牛老婆成功率：${Math.floor(
          ntrSuccessCount / ntrTotalCount * 100
        )}%
` : ""}`,
        `${divorceSwitchgear && divorceCount ? `- 离婚次数：${divorceCount}
` : ""}`,
        `${exchangeCount && exchangeCount ? `- 交换次数：${exchangeCount}
` : ""}`,
        `${fuckWifeSwitchgear && totalAffection ? `- 老婆总好感度：${totalAffection}
` : ""}`,
        `${ntrSwitchgear && targetNtrCount ? `- 被牛次数：${targetNtrCount}
` : ""}`,
        `${ntrSwitchgear && targetNtrSuccessCount ? `- 被牛成功次数：${targetNtrSuccessCount}
` : ""}`
      ]);
    } else {
      const wifeHistoriesNum = wifeUser2.wifeHistories.length;
      const drawCount = wifeUser2.drawCount;
      const ntrTotalCount = wifeUser2.ntrTotalCount;
      const ntrSuccessCount = wifeUser2.ntrSuccessCount;
      const divorceCount = wifeUser2.divorceCount;
      const exchangeCount = wifeUser2.exchangeCount;
      const totalAffection = wifeUser2.totalAffection;
      const targetNtrCount = wifeUser2.targetNtrCount;
      const targetNtrSuccessCount = wifeUser2.targetNtrSuccessCount;
      const groupDrawCount = groupData2.drawCount;
      const groupNtrCount = groupData2.ntrTotalCount;
      const groupNtrSuccessCount = groupData2.ntrSuccessCount;
      const groupDivorceCount = groupData2.divorceTotalCount;
      const groupExchangeCount = groupData2.exchangeCount;
      const groupFuckCount = groupData2.fuckTotalCount;
      const interactionWithOtherUser = wifeUser2.interactionWithOtherUser;
      let interactionFlag = false;
      let maxNtrCountUser = "";
      let maxNtrCount = 0;
      let maxNtrSuccessCountUser = "";
      let maxNtrSuccessCount = 0;
      let maxExchangeCountUser = "";
      let maxExchangeCount = 0;
      if (interactionWithOtherUser.length > 0) {
        interactionFlag = true;
        for (const item of interactionWithOtherUser) {
          if (item.ntrCount > maxNtrCount) {
            maxNtrCount = item.ntrCount;
            maxNtrCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
          if (item.ntrSuccessCount >= maxNtrSuccessCount) {
            maxNtrSuccessCount = item.ntrSuccessCount;
            maxNtrSuccessCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
          if (item.exchangeCount >= maxExchangeCount) {
            maxExchangeCount = item.exchangeCount;
            maxExchangeCountUser = (await session.bot.getUser(item.otherUserId)).name;
          }
        }
      }
      session.send([
        (0, import_koishi12.h)("quote", { id: session.messageId }),
        `- 群档案：
`,
        `${groupDrawCount ? `- 群总抽老婆次数：${groupDrawCount}
` : ""}`,
        `${ntrSwitchgear && groupNtrCount ? `- 群总牛老婆次数：${groupNtrCount}
` : ""}`,
        `${ntrSwitchgear && groupNtrSuccessCount ? `- 群总牛老婆成功次数：${groupNtrSuccessCount}
` : ""}`,
        `${divorceSwitchgear && groupDivorceCount ? `- 群总离婚次数：${groupDivorceCount}
` : ""}`,
        `${groupExchangeCount && groupExchangeCount ? `- 群总交换次数：${groupExchangeCount}
` : ""}`,
        `${fuckWifeSwitchgear && groupFuckCount ? `- 群老婆总好感度：${groupFuckCount}
` : ""}`,
        `---------------
`,
        `- 个人档案：
`,
        `- 老婆收集进度：${wifeHistoriesNum}/${wifeDataNum}
`,
        `${drawCount ? `- 抽老婆次数：${drawCount}
` : ""}`,
        `${ntrSwitchgear && ntrTotalCount ? `- 牛老婆总次数：${ntrTotalCount}
` : ""}`,
        `${ntrSwitchgear && ntrSuccessCount ? `- 牛老婆成功次数：${ntrSuccessCount}
` : ""}`,
        `${ntrSwitchgear && ntrTotalCount ? `- 牛老婆成功率：${Math.floor(
          ntrSuccessCount / ntrTotalCount * 100
        )}%
` : ""}`,
        `${divorceSwitchgear && divorceCount ? `- 离婚次数：${divorceCount}
` : ""}`,
        `${exchangeCount && exchangeCount ? `- 交换次数：${exchangeCount}
` : ""}`,
        `${fuckWifeSwitchgear && totalAffection ? `- 老婆总好感度：${totalAffection}
` : ""}`,
        `${ntrSwitchgear && targetNtrCount ? `- 被牛次数：${targetNtrCount}
` : ""}`,
        `${ntrSwitchgear && targetNtrSuccessCount ? `- 被牛成功次数：${targetNtrSuccessCount}
` : ""}`,
        `${interactionFlag && maxNtrCount ? `- 最喜欢牛的是${maxNtrCountUser}，共${maxNtrCount}次
` : ""}`,
        `${interactionFlag && maxNtrSuccessCount ? `- 牛成功最多的是${maxNtrSuccessCountUser}，共${maxNtrSuccessCount}次
` : ""}`,
        `${interactionFlag && maxExchangeCount ? `- 和${maxExchangeCountUser}交换老婆次数最多，共${maxExchangeCount}次
` : ""}`
      ]);
    }
  });
}
__name(yhda, "yhda");

// src/command/gxlpsj.ts
var import_koishi13 = require("koishi");
function gxlpsj(ctx, config) {
  ctx.command("更新老婆数据", "更新老婆数据").action(async ({ session }) => {
    if (session.userId !== config.adminId) {
      return;
    }
    await utils_default.upWifeData(ctx, config);
    session.send([(0, import_koishi13.h)("quote", { id: session.messageId }), "更新老婆数据完成"]);
  });
}
__name(gxlpsj, "gxlpsj");

// src/command/cmmlp.ts
var import_koishi14 = require("koishi");
var import_fs9 = require("fs");
var import_path9 = __toESM(require("path"));
function cmmlp(ctx, config) {
  let wifegachaPath4 = "";
  if (import_path9.default.join(__dirname).split("\\").pop() == "command") {
    wifegachaPath4 = import_path9.default.join(
      __dirname,
      "../../../..",
      "data/assets/wifegacha"
    );
  } else {
    wifegachaPath4 = import_path9.default.join(
      __dirname,
      "../../..",
      "data/assets/wifegacha"
    );
  }
  ctx.command("重命名 <name> <newName> 重命名老婆").action(async ({ session }, name2, newName) => {
    if (!config.wifeUpdateGroup.includes(session.userId.toString()) && !config.wifeAllOperationGroup.includes(session.userId.toString()) && session.userId !== config.adminId) {
      return [(0, import_koishi14.h)("quote", { id: session.messageId }), "你无权重命名老婆"];
    }
    if (!name2 || !newName)
      return [(0, import_koishi14.h)("quote", { id: session.messageId }), "缺少参数"];
    if (name2.split(config.wifeNameSeparator).length < 2 || newName.split(config.wifeNameSeparator).length < 2) {
      return [(0, import_koishi14.h)("quote", { id: session.messageId }), "老婆名称格式错误,请使用" + config.wifeNameSeparator + "分隔来源和名称"];
    }
    if (name2 === newName) {
      return [(0, import_koishi14.h)("quote", { id: session.messageId }), "新名称与旧名称相同"];
    }
    const wifeData2 = await ctx.database.get("wifeData", { name: name2.split(config.wifeNameSeparator)[1] });
    if (wifeData2.length === 0) {
      return [(0, import_koishi14.h)("quote", { id: session.messageId }), "该老婆不存在，请使用添加老婆命令"];
    }
    (0, import_fs9.renameSync)(wifeData2[0].filepath, import_path9.default.join(wifegachaPath4, `${newName}.png`));
    await ctx.database.set("wifeData", {
      name: newName.split(config.wifeNameSeparator)[1]
    }, {
      comeFrom: newName.split(config.wifeNameSeparator)[0],
      filepath: import_path9.default.join(wifegachaPath4, `${newName}.png`)
    });
    const imageBuffer = await utils_default.readImageAsBinarySync(import_path9.default.join(wifegachaPath4, `${newName}.png`));
    session.send([
      (0, import_koishi14.h)("quote", { id: session.messageId }),
      "老婆更新成功",
      import_koishi14.h.image(imageBuffer, "image/png")
    ]);
  });
}
__name(cmmlp, "cmmlp");

// src/command/index.ts
var command_default = {
  clp,
  nlp,
  chalp,
  lptj,
  lh,
  jhlp,
  rlp,
  tjlp,
  sclp,
  gxlp,
  lpda,
  yhda,
  gxlpsj,
  cmmlp
};

// src/index.ts
var name = "wifegacha";
var inject = ["database"];
var Config = import_koishi15.Schema.intersect([
  import_koishi15.Schema.object({
    wifeNameSeparator: import_koishi15.Schema.string().default("+").description("老婆'名称' '来源'分隔符"),
    adminId: import_koishi15.Schema.string().required().description("管理员ID"),
    wifeImageQuality: import_koishi15.Schema.number().default(75).min(50).max(100).step(1).role("slider").description("老婆图鉴质量(50-100)"),
    lpdaDateInterval: import_koishi15.Schema.number().default(10).description("档案查询时间间隔(秒)"),
    blockGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).default([]).collapse().description("屏蔽的群组")
  }).description("基础设置"),
  import_koishi15.Schema.object({
    ntrOrdinal: import_koishi15.Schema.number().default(5).description("牛老婆次数"),
    probabilityMath: import_koishi15.Schema.number().role("slider").min(0).max(100).step(1).default(50).description("牛老婆概率(0-100)"),
    ntrSwitchgear: import_koishi15.Schema.boolean().default(true).description("牛老婆总开关"),
    ntrBlockGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).default([]).collapse().description("牛老婆屏蔽群组")
  }).description("牛老婆设置"),
  import_koishi15.Schema.object({
    illustratedBook: import_koishi15.Schema.boolean().default(false).description("图鉴收集是否包含牛老婆")
  }).description("图鉴设置"),
  import_koishi15.Schema.object({
    divorceLimit: import_koishi15.Schema.number().default(10).description("离婚次数限制"),
    divorceSwitchgear: import_koishi15.Schema.boolean().default(true).description("离婚总开关"),
    divorceBlockGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).default([]).collapse().description("离婚屏蔽群组")
  }).description("离婚设置"),
  import_koishi15.Schema.object({
    fuckWifeSwitchgear: import_koishi15.Schema.boolean().default(true).description("日老婆总开关"),
    fuckWifeCoolingTime: import_koishi15.Schema.number().default(10).description("日老婆冷却时间(秒)"),
    fuckWifeDetailedReply: import_koishi15.Schema.boolean().default(false).description("详细回复"),
    fuckWifeVoiceReply: import_koishi15.Schema.boolean().default(false).description("语音回复"),
    fuckWifeBlockGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).default([]).collapse().description("日老婆屏蔽群组")
  }).description("日老婆设置"),
  import_koishi15.Schema.object({
    wifeAllOperationGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).role("table").description("允许所有老婆操作权限的用户组"),
    wifeUploadGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).role("table").description("仅允许上传老婆权限的用户组"),
    wifeUpdateGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).role("table").description("仅允许更新老婆权限的用户组"),
    wifeDeleteGroup: import_koishi15.Schema.array(import_koishi15.Schema.string()).role("table").description("仅允许删除老婆权限的用户组")
  }).description("老婆更新权限设置")
]);
var wifegachaPath3 = import_path10.default.join(__dirname, "../../..", "data/assets/wifegacha");
async function apply(ctx, config) {
  await module2(ctx, config);
  ctx.logger.info("数据库初始化完成");
  sprit_default.ensureDirs();
  ctx.logger.info("sprit初始化完成");
  if (!(0, import_fs10.existsSync)(wifegachaPath3)) {
    ctx.logger.info("wifegacha文件夹不存在,开始初始化");
    (0, import_fs10.mkdirSync)(wifegachaPath3);
  }
  if ((await ctx.database.get("wifeData", {})).length === 0) {
    ctx.logger.info("wifeData表中没有数据,开始初始化");
    createWifeData(ctx, config);
  }
  command_default.clp(ctx);
  command_default.nlp(ctx, config);
  command_default.chalp(ctx);
  command_default.lptj(ctx, config);
  command_default.lh(ctx, config);
  command_default.jhlp(ctx);
  command_default.rlp(ctx, config);
  command_default.tjlp(ctx, config);
  command_default.sclp(ctx, config);
  command_default.gxlp(ctx, config);
  command_default.lpda(ctx, config);
  command_default.yhda(ctx, config);
  command_default.gxlpsj(ctx, config);
  command_default.cmmlp(ctx, config);
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name
});
