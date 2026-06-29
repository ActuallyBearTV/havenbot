const { SELF_ROLES } = require("../config/constants");
const { findRole } = require("../utils/finders");

async function toggleSelfRole(interaction) {
  const selected = SELF_ROLES.find(role => role.id === interaction.customId);

  if (!selected) {
  return interaction.reply({
    content: "❌ This role button is outdated. Ask staff to repost the role panel.",
    ephemeral: true
  });
}

  const role = findRole(interaction.guild, selected.name);

  if (!role) {
    return interaction.reply({
      content: `❌ I couldn't find the **${selected.name}** role.`,
      ephemeral: true
    });
  }

  const singleChoiceGroups = ["gender", "age", "location"];

  if (singleChoiceGroups.includes(selected.group)) {
    const rolesToRemove = SELF_ROLES
      .filter(item => item.group === selected.group)
      .map(item => findRole(interaction.guild, item.name))
      .filter(Boolean);

    await interaction.member.roles.remove(rolesToRemove).catch(() => null);
  }

  if (interaction.member.roles.cache.has(role.id)) {
    await interaction.member.roles.remove(role);

    return interaction.reply({
      content: `❌ Removed **${role.name}**.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(role);

  return interaction.reply({
    content: `✅ Added **${role.name}**.`,
    ephemeral: true
  });
}

module.exports = { toggleSelfRole };
