const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "levels.json");

const cooldowns = new Map();

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");
}

function readData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function xpNeeded(level) {
    return 50 * level * level;
}

function getUser(guildId, userId) {
  const data = readData();

  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) {
    data[guildId][userId] = {
      xp: 0,
      level: 1,
      messages: 0
    };
  }

  saveData(data);
  return data[guildId][userId];
}

async function handleMessageXP(message) {
  if (!message.guild || message.author.bot) return;

  const key = `${message.guild.id}-${message.author.id}`;
  if (cooldowns.has(key)) return;

  cooldowns.set(key, true);
  setTimeout(() => cooldowns.delete(key), 60000);

  const data = readData();

  if (!data[message.guild.id]) data[message.guild.id] = {};
  if (!data[message.guild.id][message.author.id]) {
    data[message.guild.id][message.author.id] = {
      xp: 0,
      level: 1,
      messages: 0
    };
  }

  const userData = data[message.guild.id][message.author.id];

  const gainedXP = Math.floor(Math.random() * 11) + 15;
  userData.xp += gainedXP;
  userData.messages += 1;

  const needed = xpNeeded(userData.level);

  if (userData.xp >= needed) {
    userData.xp -= needed;
    userData.level += 1;

    await message.channel.send({
      content: `🎉 GG ${message.author}, you reached **Level ${userData.level}**!`
    });
  }

  saveData(data);
}

function getRank(guildId, userId) {
  return getUser(guildId, userId);
}

function getLeaderboard(guildId) {
  const data = readData();
  const guildData = data[guildId] || {};

  return Object.entries(guildData)
    .map(([userId, stats]) => ({
      userId,
      ...stats
    }))
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp;
    })
    .slice(0, 10);
}

module.exports = {
  handleMessageXP,
  getRank,
  getLeaderboard,
  xpNeeded
};
