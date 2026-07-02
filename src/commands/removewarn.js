const fs = require("node:fs");
const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const warningsPath = path.join(__dirname, "..", "data", "warnings.json");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

function loadWarnings() {
  if (!fs.existsSync(warningsPath)) return {};
  return JSON.parse(fs.readFileSync(warningsPath, "utf8"));
}

function saveWarnings(data) {
  fs.writeFileSync(warningsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove a specific warning from a member.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The member")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("warning-id")
        .setDescription("The warning ID to remove")
        .setRequired(true)
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
    const warningId = interaction.options.getString("warning-id");

    const data = loadWarnings();
    const warnings = data[interaction.guild.id]?.[user.id] || [];

    const index = warnings.findIndex(warn => String(warn.id) === warningId);

    if (index === -1) {
      return interaction.reply({
        content: "❌ I couldn't find that warning ID for this member.",
        ephemeral: true
      });
    }

    const removed = warnings.splice(index, 1)[0];

    data[interaction.guild.id][user.id] = warnings;
    saveWarnings(data);

    await interaction.reply({
      content: `✅ Removed warning \`${warningId}\` from ${user}.\nRemaining warnings: **${warnings.length}**`,
      ephemeral: true
    });

    await sendStaffLog(interaction.guild, {
      title: "🗑️ Warning Removed",
      description: `${interaction.user} removed a warning from ${user}.`,
      staff: interaction.user,
      user,
      extra:
        `**Warning ID:** ${warningId}\n` +
        `**Old Reason:** ${removed.reason}\n` +
        `**Remaining Warnings:** ${warnings.length}`,
      color: "#22C55E"
    });
  }
};
