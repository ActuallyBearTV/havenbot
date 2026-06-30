const { PermissionsBitField } = require("discord.js");

const rewards = [
  { level: 5, name: "🌱 Level 5" },
  { level: 10, name: "⭐ Level 10" },
  { level: 20, name: "💜 Level 20" },
  { level: 30, name: "🔥 Level 30" },
  { level: 50, name: "👑 Level 50" }
];

async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({
      content: "You need Administrator permission to use this.",
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const created = [];

  for (const reward of rewards) {
    let role = interaction.guild.roles.cache.find(r => r.name === reward.name);

    if (!role) {
      role = await interaction.guild.roles.create({
        name: reward.name,
        reason: `Level reward role for Level ${reward.level}`
      });

      created.push(role.name);
    }
  }

  return interaction.editReply({
    content: created.length
      ? `✅ Created level reward roles:\n${created.join("\n")}`
      : "✅ All level reward roles already exist."
  });
}

module.exports = { execute, rewards };
