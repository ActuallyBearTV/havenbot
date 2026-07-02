const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages from this channel.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

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

    const amount = interaction.options.getInteger("amount");

    const deleted = await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({
      content: `✅ Deleted ${deleted.size} message(s).`,
      ephemeral: true
    });

    await sendStaffLog(interaction.guild, {
      title: "🗑️ Messages Purged",
      description: `${interaction.user} deleted messages in ${interaction.channel}.`,
      staff: interaction.user,
      extra: `**Amount Deleted:** ${deleted.size}`,
      color: "#F59E0B"
    });
  }
};
