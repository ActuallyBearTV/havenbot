const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");
const { hasStaffPermission, staffRoleIds } = require("../utils/staffPermissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock this channel."),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: null,
      ReadMessageHistory: null,
      SendMessages: true,
      SendMessagesInThreads: true,
      CreatePublicThreads: true,
      CreatePrivateThreads: true
    });

    for (const roleId of staffRoleIds) {
      await channel.permissionOverwrites.edit(roleId, {
        ViewChannel: true,
        ReadMessageHistory: true,
        SendMessages: true,
        SendMessagesInThreads: true,
        CreatePublicThreads: true,
        CreatePrivateThreads: true
      });
    }

    await interaction.reply({
      content: `🔓 ${channel} has been unlocked. Everyone can talk again.`
    });

    await sendStaffLog(interaction.guild, {
      title: "🔓 Channel Unlocked",
      description: `${interaction.user} unlocked ${channel}.`,
      staff: interaction.user,
      extra: `**Channel:** ${channel}`,
      color: "#57F287"
    });
  }
};
