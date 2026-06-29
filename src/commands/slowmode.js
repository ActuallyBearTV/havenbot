const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for this channel.")
    .addIntegerOption(option =>
      option
        .setName("seconds")
        .setDescription("Slowmode in seconds. Use 0 to disable.")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger("seconds");

    await interaction.channel.setRateLimitPerUser(seconds);

    await interaction.reply({
      content: seconds === 0
        ? `✅ Slowmode disabled in ${interaction.channel}.`
        : `⏱️ Slowmode set to **${seconds} seconds** in ${interaction.channel}.`
    });

    await sendStaffLog(interaction.guild, {
      title: "⏱️ Slowmode Updated",
      description: `${interaction.user} updated slowmode in ${interaction.channel}.`,
      staff: interaction.user,
      extra: `**Slowmode:** ${seconds} seconds`,
      color: "#F59E0B"
    });
  }
};
