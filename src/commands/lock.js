const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428",  // Admin
  "1521148635448868974" // Owner
];

function hasStaffPermission(interaction) {
  return (
    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))
  );
}

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
        allowedRoles.includes(role.id)
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
