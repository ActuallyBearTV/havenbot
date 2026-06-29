const { EmbedBuilder } = require("discord.js");

function havenEmbed(title, description, color = "#8B5CF6") {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: "Haven • A community to belong" })
    .setTimestamp();
}

module.exports = { havenEmbed };
