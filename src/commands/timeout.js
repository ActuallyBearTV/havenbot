const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

function parseDuration(duration) {
  const match = duration.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const amount = parseInt(match[1]);
  const unit = match[2];

  if (unit === "s") return amount * 1000;
  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;
  if (unit === "d") return amount * 24 * 60 * 60 * 1000;

  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to timeout").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration").setDescription("Duration: 10s, 5m, 1h, 1d").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the timeout").setRequired(false)
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

    const user = interaction.options.getUser("user");
    const durationText = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ I couldn't find that member in this server.",
        ephemeral: true
      });
    }

    const durationMs = parseDuration(durationText);

    if (!durationMs) {
      return interaction.reply({
        content: "❌ Invalid duration. Use something like `10s`, `5m`, `1h`, or `1d`.",
        ephemeral: true
      });
    }

    if (durationMs > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        content: "❌ Timeout duration cannot be longer than 28 days.",
        ephemeral: true
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ I can't timeout this member. Their role may be higher than mine.",
        ephemeral: true
      });
    }

    await member.timeout(durationMs, reason);

    await interaction.reply({
      content: `⏳ ${user} has been timed out for **${durationText}**.\nReason: ${reason}`
    });

    await sendStaffLog(interaction.guild, {
      title: "⏳ Member Timed Out",
      description: `${interaction.user} timed out ${user}.`,
      staff: interaction.user,
      user,
      extra: `**Duration:** ${durationText}\n**Reason:** ${reason}`,
      color: "#F59E0B"
    });
  }
};
