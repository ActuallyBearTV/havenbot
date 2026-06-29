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

  return interaction.reply({
    content: "🎉 Welcome to Haven! You have been verified.",
    ephemeral: true
  });
}

module.exports = {
  verifyMember
};
