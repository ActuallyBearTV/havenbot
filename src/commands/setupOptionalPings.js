async function postOptionalPingMenu(guild) {
  const channel = findChannel(guild, "🔔・notification-roles");

  if (!channel) {
    throw new Error("Could not find 🔔・notification-roles channel.");
  }

  const row = new ActionRowBuilder();

  OPTIONAL_PINGS.forEach(ping => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(ping.id)
        .setLabel(ping.name)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  await channel.send({
    embeds: [
      havenEmbed(
        "Optional Pings ♡₊˚",
        [
          "Choose which notifications you'd like to receive!",
          "",
          "💗 **Chat Revive**",
          "Be notified when we're trying to get chat active again.",
          "",
          "🎙️ **VC Revive**",
          "Get pinged whenever people are looking to start a voice chat.",
          "",
          "❓ **Daily Question**",
          "Receive a daily conversation starter to join in with the community.",
          "",
          "📢 **Announcement Ping**",
          "Be notified when important server announcements are posted.",
          "",
          "🚀 **Bump Reminder**",
          "Get reminded when it's time to bump the server.",
          "",
          "You can enable or disable these at any time by clicking the buttons below."
        ].join("\n"),
        "#F9A8D4"
      )
    ],
    components: [row]
  });
}
