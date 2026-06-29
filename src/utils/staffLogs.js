const { havenEmbed } = require("./embed");
const { findChannel } = require("./finders");

async function sendStaffLog(guild, title, message, color = "#60A5FA") {
  const logChannel =
    findChannel(guild, "📊・staff-logs") ||
    findChannel(guild, "staff-logs");

  if (!logChannel) {
    console.log("❌ Staff log channel not found.");
    return;
  }

  return logChannel.send({
    embeds: [havenEmbed(title, message, color)]
  });
}

module.exports = {
  sendStaffLog
};
