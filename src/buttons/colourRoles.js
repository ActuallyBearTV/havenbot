const { COLOUR_ROLES } = require("../config/constants");
const { findRole } = require("../utils/finders");

async function toggleColourRole(interaction) {
  const selectedColour = COLOUR_ROLES.find(
    colour => colour.id === interaction.customId
  );

  if (!selectedColour) return;

  const selectedRole = findRole(interaction.guild, selectedColour.name);

  if (!selectedRole) {
    return interaction.reply({
      content: "That colour role does not exist yet. Ask staff to run `/setup-colour-roles`.",
      ephemeral: true
    });
  }

  const colourRoleIds = COLOUR_ROLES
    .map(colour => findRole(interaction.guild, colour.name))
    .filter(Boolean)
    .map(role => role.id);

  const rolesToRemove = interaction.member.roles.cache
    .filter(role => colourRoleIds.includes(role.id) && role.id !== selectedRole.id)
    .map(role => role.id);

  if (rolesToRemove.length > 0) {
    await interaction.member.roles.remove(rolesToRemove);
  }

  if (interaction.member.roles.cache.has(selectedRole.id)) {
    await interaction.member.roles.remove(selectedRole);

    return interaction.reply({
      content: `Removed ${selectedColour.name}.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(selectedRole);

  return interaction.reply({
    content: `Your colour is now ${selectedColour.name}.`,
    ephemeral: true
  });
}

module.exports = {
  toggleColourRole
};
