const { PermissionFlagsBits } = require("discord.js");

const { COLOUR_ROLES } = require("../config/constants");

function getEmojiId(emoji) {
  const customEmoji = emoji?.match(/<a?:\w+:(\d+)>/);
  return customEmoji ? customEmoji[1] : emoji;
}

function getCleanName(name) {
  return name.replace(/^[^\p{L}\p{N}]+/u, "").trim();
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
      content: "Setting up the colour reaction roles...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        return (
          message.author.id === interaction.client.user.id &&
          message.content.includes("**colour roles**")
        );
      });

      for (const oldPanel of oldPanels.values()) {
        try {
          await oldPanel.delete();
        } catch (error) {
          console.warn(
            `Could not delete old colour panel ${oldPanel.id}:`,
            error.message
          );
        }
      }

      const validColours = COLOUR_ROLES.filter(colour => {
        const role = interaction.guild.roles.cache.get(
          colour.roleId
        );

        if (!role) {
          console.warn(
            `Missing colour role: ${colour.name} (${colour.roleId})`
          );

          return false;
        }

        if (!colour.emoji) {
          console.warn(
            `Missing emoji for colour: ${colour.name}`
          );

          return false;
        }

        return true;
      });

      if (validColours.length === 0) {
        throw new Error(
          "No valid colour roles were found. Check the role IDs and emojis in constants.js."
        );
      }

      const roleList = validColours
        .map(colour => {
          return `${colour.emoji}  **${getCleanName(colour.name)}**`;
        })
        .join("\n");

      const message = await channel.send({
        content: [
          "˖ ࣪ ⊹ **colour roles** ୨୧ ˖",
          "",
          "⊹ react below to choose your name colour.",
          "⊹ choosing a new colour removes your previous colour.",
          "⊹ remove your reaction to remove the role.",
          "",
          roleList
        ].join("\n")
      });

      for (const colour of validColours) {
        try {
          await message.react(
            getEmojiId(colour.emoji)
          );
        } catch (error) {
          console.error(
            `Could not add reaction for ${colour.name}:`,
            error
          );
        }
      }

      await interaction.editReply({
        content: `✅ Colour reaction roles posted in ${channel}.`
      });
    } catch (error) {
      console.error(
        "Colour role setup error:",
        error
      );

      await interaction.editReply({
        content: `❌ ${error.message}`
      });
    }
  }
};
