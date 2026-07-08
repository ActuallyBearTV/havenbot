const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listroles")
    .setDescription("Lists all role IDs"),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => `**${role.name}**\n\`${role.id}\``)
      .join("\n\n");

    await interaction.reply({
      content: roles.length > 1900 ? "Too many roles." : roles,
      ephemeral: true
    });
  }
};
