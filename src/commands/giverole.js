const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giverole")
    .setDescription("Give a role to one member or everyone.")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role to give")
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member to give the role to")
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName("everyone")
        .setDescription("Give the role to every non-bot member")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const user = interaction.options.getUser("user");
    const everyone = interaction.options.getBoolean("everyone") ?? false;

    if (!user && !everyone) {
      return interaction.reply({
        content: "❌ Choose a user or set **everyone** to true.",
        ephemeral: true
      });
    }

    if (user && everyone) {
      return interaction.reply({
        content: "❌ Choose either a user or everyone, not both.",
        ephemeral: true
      });
    }

    if (user) {
      const member = await interaction.guild.members.fetch(user.id);

      if (member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: `${member} already has ${role}.`,
          ephemeral: true
        });
      }

      await member.roles.add(role);

      return interaction.reply({
        content: `✅ Gave ${role} to ${member}.`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `⏳ Giving ${role} to everyone...`,
      ephemeral: true
    });

    await interaction.guild.members.fetch();

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const member of interaction.guild.members.cache.values()) {
      if (member.user.bot) {
        skipped++;
        continue;
      }

      if (member.roles.cache.has(role.id)) {
        skipped++;
        continue;
      }

      try {
        await member.roles.add(role);
        success++;
      } catch {
        failed++;
      }
    }

    await interaction.followUp({
      content:
        `✅ Finished!\n\n` +
        `Given: **${success}**\n` +
        `Skipped: **${skipped}**\n` +
        `Failed: **${failed}**`,
      ephemeral: true
    });
  }
};
