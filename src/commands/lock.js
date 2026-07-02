const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");
const { hasStaffPermission, staffRoleIds } = require("../utils/staffPermissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock this channel so members cannot send messages."),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false
    });

    for (const role of interaction.guild.roles.cache.values()) {
      if (
        role.id === interaction.guild.id ||
        role.managed ||
        staffRoleIds.includes(role.id)
      ) continue;

      await channel.permissionOverwrites.edit(role, {
        SendMessages: false,
        SendMessagesInThreads: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false
      }).catch(() => null);
    }

    await interaction.editReply({
      content: `🔒 ${channel} has been locked.`
    });

    await sendStaffLog(interaction.guild, {
      title: "🔒 Channel Locked",
      description: `${interaction.user} locked ${channel}.`,
      staff: interaction.user,
      extra: `**Channel:** ${channel}`,
      color: "#EF4444"
    });
  }
};
