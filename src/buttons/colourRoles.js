const { COLOUR_ROLES } = require("../config/constants");

async function toggleColourRole(interaction) {
  const selectedColour = COLOUR_ROLES.find(
    colour => colour.id === interaction.customId
  );

  if (!selectedColour) return;

  const selectedRole = interaction.guild.roles.cache.get(selectedColour.roleId);

  if (!selectedRole) {
    return interaction.reply({
      content: "That colour role does not exist. Check the role ID in `roles.js`.",
      ephemeral: true
    });
  }

  const colourRoleIds = COLOUR_ROLES
    .map(colour => colour.roleId)
    .filter(Boolean);

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
