const { EmbedBuilder } = require("discord.js");

function havenEmbed(title, message, color = "#8B5CF6") {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(message)
    .setFooter({
      text: "Haven • A community to belong"
    })
    .setTimestamp();
}

module.exports = {
  havenEmbed
};
