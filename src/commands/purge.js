const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
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
