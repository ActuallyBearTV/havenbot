// src/utils/staffLogs.js
const { EmbedBuilder } = require("discord.js");

const STAFF_LOG_CHANNEL_ID = process.env.STAFF_LOG_CHANNEL_ID;

async function sendStaffLog(guild, options) {
  if (!guild || !STAFF_LOG_CHANNEL_ID) return;

  const channel = guild.channels.cache.get(STAFF_LOG_CHANNEL_ID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(options.color || "#2b6cff")
    .setTitle(options.title || "Staff Log")
    .setDescription(options.description || "No details provided.")
    .setTimestamp();

  if (options.user) {
    embed.addFields({
      name: "User",
      value: `${options.user} \`${options.user.id}\``,
      inline: false
    });
  }

  if (options.staff) {
    embed.addFields({
      name: "Staff",
      value: `${options.staff} \`${options.staff.id}\``,
      inline: false
    });
  }

  if (options.extra) {
    embed.addFields({
      name: "Details",
      value: options.extra,
      inline: false
    });
  }

  await channel.send({ embeds: [embed] });
}

module.exports = { sendStaffLog };
