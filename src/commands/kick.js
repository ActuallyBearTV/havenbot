const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The member to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the kick")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ I couldn't find that member in this server.",
        ephemeral: true
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ I can't kick this member. Their role may be higher than mine.",
        ephemeral: true
      });
    }

    await member.kick(reason);

    await interaction.reply({
      content: `👢 ${user} has been kicked.\nReason: ${reason}`
    });

    await sendStaffLog(interaction.guild, {
      title: "👢 Member Kicked",
      description: `${interaction.user} kicked ${user}.`,
      staff: interaction.user,
      user,
      extra: `**Reason:** ${reason}`,
      color: "#EF4444"
    });
  }
};
