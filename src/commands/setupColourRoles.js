const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { havenEmbed } = require("../utils/embed");
const { findChannel, findRole } = require("../utils/finders");
const { COLOUR_ROLES } = require("../config/constants");

async function createColourRoles(guild) {
  for (const colour of COLOUR_ROLES) {
    const existingRole = findRole(guild, colour.name);

    if (!existingRole) {
      await guild.roles.create({
        name: colour.name,
        color: colour.hex,
        hoist: false,
        mentionable: false,
        reason: "Haven colour role setup"
      });
    }
  }
}

async function postColourRoleMenu(guild) {
  const channel = findChannel(guild, "🎨・colour-roles");

  if (!channel) {
    throw new Error("Could not find 🎨・colour-roles channel.");
  }

  const rows = [];
  let currentRow = new ActionRowBuilder();

  COLOUR_ROLES.forEach((colour, index) => {
    if (index > 0 && index % 4 === 0) {
      rows.push(currentRow);
      currentRow = new ActionRowBuilder();
    }

    currentRow.addComponents(
      new ButtonBuilder()
        .setCustomId(colour.id)
        .setLabel(colour.name)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  rows.push(currentRow);

  await channel.send({
    embeds: [
      havenEmbed(
        "🎨 Choose Your Colour",
        `Personalise your name with your favourite colour!

Click a button below to choose your colour role.

• You can only have one colour role.
• Choosing another colour removes the old one.`
      )
    ],
    components: rows
  });
}

module.exports = {
  name: "setup-colour-roles",

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "You need Administrator permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Setting up colour roles...",
      ephemeral: true
    });

    await createColourRoles(interaction.guild);
    await postColourRoleMenu(interaction.guild);

    await interaction.followUp({
      content: "✅ Colour roles created.",
      ephemeral: true
    });
  }
};
