const { havenEmbed } = require("../utils/embed");
const { findChannel } = require("../utils/finders");

async function sendWelcome(member) {
  const channel =
  findChannel(member.guild, "💬・general") ||
  findChannel(member.guild, "general");

  if (!channel) {
    console.log("❌ Welcome channel not found.");
    return;
  }

  await channel.send({
    content: `${member}`,
    embeds: [
      havenEmbed(
        "🌙 Welcome to Haven!",
        [
          `Welcome ${member}! ❤️`,
          "",
          "We're so happy you've joined **Haven**.",
          "",
          "**Before you get chatting:**",
          "✅ Verify yourself",
          "🎨 Choose your colour",
          "🔔 Pick your notification roles",
          "🙋 Introduce yourself",
          "",
          `You are member **#${member.guild.memberCount}**.`,
          "",
          "We hope you enjoy your stay!"
        ].join("\n"),
        "#F472B6"
      )
    ]
  });
}

module.exports = {
  sendWelcome
};
