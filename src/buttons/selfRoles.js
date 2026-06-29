const roleGroups = {
  gender: ["Male", "Female", "Non-Binary"],
  age: ["18-20", "21-24", "25-29", "30+"],
  location: ["UK", "Europe", "North America", "Asia", "Oceania", "Other"],
  interest: ["Gaming", "Music", "Movies", "Anime", "Minecraft", "Art"]
};

async function toggleSelfRole(interaction) {
  const [group, ...roleParts] = interaction.customId.split("_");
  const roleName = roleParts.join(" ");

  const allowedRoles = roleGroups[group];

  if (!allowedRoles) {
    return interaction.reply({
      content: "❌ Unknown role group.",
      ephemeral: true
    });
  }

  const role = interaction.guild.roles.cache.find(r => r.name === roleName);

  if (!role) {
    return interaction.reply({
      content: `❌ I couldn't find the **${roleName}** role.`,
      ephemeral: true
    });
  }

  const member = interaction.member;

  const singleChoiceGroups = ["gender", "age", "location"];

  if (singleChoiceGroups.includes(group)) {
    const rolesToRemove = allowedRoles
      .map(name => interaction.guild.roles.cache.find(r => r.name === name))
      .filter(Boolean);

    await member.roles.remove(rolesToRemove).catch(() => null);
  }

  if (member.roles.cache.has(role.id)) {
    await member.roles.remove(role);

    return interaction.reply({
      content: `❌ Removed **${role.name}**.`,
      ephemeral: true
    });
  }

  await member.roles.add(role);

  return interaction.reply({
    content: `✅ Added **${role.name}**.`,
    ephemeral: true
  });
}

module.exports = { toggleSelfRole };
