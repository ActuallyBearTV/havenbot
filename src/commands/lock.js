const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock this channel so members cannot send messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    await interaction.reply({
      content: `🔒 ${interaction.channel} has been locked.`,
      ephemeral: false
    });

    await sendStaffLog(interaction.guild, {
      title: "🔒 Channel Locked",
      description: `${interaction.user} locked ${interaction.channel}.`,
      staff: interaction.user,
      extra: `**Channel:** ${interaction.channel}`,
      color: "#EF4444"
    });
  }
};
