const { OPTIONAL_PINGS } = require("../config/constants");
const { findRole } = require("../utils/finders");

async function toggleOptionalPing(interaction) {
  const selectedPing = OPTIONAL_PINGS.find(
    ping => ping.id === interaction.customId
  );

  if (!selectedPing) return;

  const selectedRole = findRole(interaction.guild, selectedPing.name);

  if (!selectedRole) {
    return interaction.reply({
      content: "That notification role does not exist yet. Ask staff to run `/setup-optional-pings`.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(selectedRole.id)) {
    await interaction.member.roles.remove(selectedRole);

    return interaction.reply({
      content: `Removed ${selectedPing.name}.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(selectedRole);

  return interaction.reply({
    content: `Added ${selectedPing.name}.`,
    ephemeral: true
  });
}

module.exports = {
  toggleOptionalPing
};
