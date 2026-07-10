const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { havenEmbed } = require("../utils/embed");
const { COLOUR_ROLES } = require("../config/constants");

function createColourRows() {
  const rows = [];

  for (let i = 0; i < COLOUR_ROLES.length; i += 4) {
    const row = new ActionRowBuilder();

    const colours = COLOUR_ROLES.slice(i, i + 4);

    for (const colour of colours) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(colour.id)
          .setLabel(colour.name)
          .setStyle(ButtonStyle.Secondary)
      );
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  name: "setup-colour-roles",

  async execute(interaction) {
    if (
      !interaction.memberPermissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: "❌ You need Administrator permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Setting up the colour role menu...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        const title = message.embeds[0]?.title;

        return (
          message.author.id === interaction.client.user.id &&
          title === "🎨 Choose Your Colour"
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old colour panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const rows = createColourRows();

      await channel.send({
        embeds: [
          havenEmbed(
            "🎨 Choose Your Colour",
            [
              "Personalise your name with your favourite colour!",
              "",
              "Click a button below to choose your colour role.",
              "",
              "• You can only have one colour role.",
              "• Choosing another colour removes your old one.",
              "• Click your current colour again to remove it."
            ].join("\n")
          )
        ],
        components: rows
      });

      await interaction.editReply({
        content: `✅ Colour role menu posted in ${channel}.`
      });
    } catch (error) {
      console.error("Colour role setup error:", error);

      await interaction.editReply({
        content: `❌ Colour role setup failed: ${error.message}`
      });
    }
  }
};
