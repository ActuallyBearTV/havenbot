const { sendStaffLog } = require("../utils/staffLogs");
const { findRole } = require("../utils/finders");

async function verifyMember(interaction) {
  const role = findRole(interaction.guild, "✅ Verified");

  if (!role) {
    return interaction.reply({
      content: "❌ I couldn't find the **✅ Verified** role.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(role.id)) {
    return interaction.reply({
      content: "✅ You're already verified!",
      ephemeral: true
    });
  }

  await interaction.member.roles.add(role);

await sendStaffLog(interaction.guild, {
    title: "✅ Member Verified",
    description: `${interaction.user} has successfully verified.`,
    user: interaction.user,
    extra:
        `**Account Created:** <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>\n` +
        `**Joined Server:** <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R>`,
    color: "#57F287"
});
return interaction.reply({
  content: "🎉 Welcome to Haven! You have been verified.",
  ephemeral: true
});
}

module.exports = {
  verifyMember
};
