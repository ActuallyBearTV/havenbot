const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock this channel so members cannot send messages."),

  async execute(interaction) {
    const hasAllowedRole = interaction.member.roles.cache.some(role =>
      allowedRoles.includes(role.id)
    );

    if (!hasAllowedRole) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false
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
