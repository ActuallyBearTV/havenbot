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

    await interaction.deferReply();

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SendMessages: null,
        SendMessagesInThreads: null,
        CreatePublicThreads: null,
        CreatePrivateThreads: null
      }
    );

    for (const role of interaction.guild.roles.cache.values()) {
      if (
        role.id === interaction.guild.id ||
        role.managed ||
        staffRoleIds.includes(role.id)
      ) continue;

      await channel.permissionOverwrites.edit(role, {
        SendMessages: null,
        SendMessagesInThreads: null,
        CreatePublicThreads: null,
        CreatePrivateThreads: null
      }).catch(() => null);
    }

    await interaction.editReply({
      content: `🔓 ${channel} has been unlocked.`
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
