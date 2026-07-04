const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { havenEmbed } = require("../utils/embed");
const { findChannel, findRole } = require("../utils/finders");
const { OPTIONAL_PINGS } = require("../config/constants");

async function createOptionalPingRoles(guild) {
  for (const ping of OPTIONAL_PINGS) {
    const existingRole = findRole(guild, ping.name);

    if (!existingRole) {
      await guild.roles.create({
        name: ping.name,
        color: "#F9A8D4",
        hoist: false,
        mentionable: true,
        reason: "Haven optional ping role setup"
      });
    }
  }
}

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

module.exports = {
  name: "setup-optional-pings",

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "You need Administrator permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Setting up optional pings...",
      ephemeral: true
    });

    await createOptionalPingRoles(interaction.guild);
    await postOptionalPingMenu(interaction.guild);

    return interaction.followUp({
      content: "✅ Optional ping roles created.",
      ephemeral: true
    });
  }
};
