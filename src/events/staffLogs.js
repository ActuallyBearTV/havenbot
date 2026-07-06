const { EmbedBuilder, AuditLogEvent } = require("discord.js");

const STAFF_LOG_CHANNEL_NAME = "•₊˚๑🌷│staff-logsˎˊ˗";

function getStaffLogChannel(guild) {
  return guild.channels.cache.find(
    channel => channel.name === STAFF_LOG_CHANNEL_NAME
  );
}

async function sendStaffLog(guild, title, description, color = 0xffb6c1) {
  const channel = getStaffLogChannel(guild);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => {});
}

function setupStaffLogs(client) {
  client.on("messageDelete", async message => {
    if (!message.guild || message.author?.bot) return;

    await sendStaffLog(
      message.guild,
      "🗑️ Message Deleted",
      [
        `**User:** ${message.author} (${message.author.tag})`,
        `**Channel:** ${message.channel}`,
        "",
        `**Message:**`,
        message.content || "*No text content / attachment only*"
      ].join("\n"),
      0xff6b6b
    );
  });

  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    await sendStaffLog(
      oldMessage.guild,
      "✏️ Message Edited",
      [
        `**User:** ${oldMessage.author} (${oldMessage.author.tag})`,
        `**Channel:** ${oldMessage.channel}`,
        "",
        `**Before:**`,
        oldMessage.content || "*No text content*",
        "",
        `**After:**`,
        newMessage.content || "*No text content*"
      ].join("\n"),
      0xffc857
    );
  });

  client.on("guildMemberAdd", async member => {
    await sendStaffLog(
      member.guild,
      "📥 Member Joined",
      `**User:** ${member.user} (${member.user.tag})`,
      0x77dd77
    );
  });

  client.on("guildMemberRemove", async member => {
    await sendStaffLog(
      member.guild,
      "📤 Member Left",
      `**User:** ${member.user} (${member.user.tag})`,
      0xff9aa2
    );
  });

  client.on("guildBanAdd", async ban => {
    await sendStaffLog(
      ban.guild,
      "🔨 Member Banned",
      `**User:** ${ban.user} (${ban.user.tag})`,
      0xff0000
    );
  });

  client.on("guildBanRemove", async ban => {
    await sendStaffLog(
      ban.guild,
      "🔓 Member Unbanned",
      `**User:** ${ban.user} (${ban.user.tag})`,
      0x77dd77
    );
  });

  client.on("channelCreate", async channel => {
    if (!channel.guild) return;

    await sendStaffLog(
      channel.guild,
      "➕ Channel Created",
      `**Channel:** ${channel}`,
      0x77dd77
    );
  });

  client.on("channelDelete", async channel => {
    if (!channel.guild) return;

    await sendStaffLog(
      channel.guild,
      "➖ Channel Deleted",
      `**Channel Name:** ${channel.name}`,
      0xff6b6b
    );
  });

  client.on("roleCreate", async role => {
    await sendStaffLog(
      role.guild,
      "➕ Role Created",
      `**Role:** ${role.name}`,
      0x77dd77
    );
  });

  client.on("roleDelete", async role => {
    await sendStaffLog(
      role.guild,
      "➖ Role Deleted",
      `**Role:** ${role.name}`,
      0xff6b6b
    );
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
      await sendStaffLog(
        newMember.guild,
        "📝 Nickname Changed",
        [
          `**User:** ${newMember.user} (${newMember.user.tag})`,
          `**Before:** ${oldMember.nickname || oldMember.user.username}`,
          `**After:** ${newMember.nickname || newMember.user.username}`
        ].join("\n"),
        0xffc857
      );
    }

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

    if (addedRoles.size > 0) {
      await sendStaffLog(
        newMember.guild,
        "✅ Role Added",
        [
          `**User:** ${newMember.user} (${newMember.user.tag})`,
          `**Role:** ${addedRoles.map(role => role.name).join(", ")}`
        ].join("\n"),
        0x77dd77
      );
    }

    if (removedRoles.size > 0) {
      await sendStaffLog(
        newMember.guild,
        "❌ Role Removed",
        [
          `**User:** ${newMember.user} (${newMember.user.tag})`,
          `**Role:** ${removedRoles.map(role => role.name).join(", ")}`
        ].join("\n"),
        0xff6b6b
      );
    }
  });
}

module.exports = { setupStaffLogs };
