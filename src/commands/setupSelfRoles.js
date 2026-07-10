const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  AttachmentBuilder
} = require("discord.js");

const path = require("path");
const { SELF_ROLES } = require("../config/constants");

function createRows(group) {
  const roles = SELF_ROLES.filter(role => role.group === group);
  const rows = [];

  for (let i = 0; i < roles.length; i += 5) {
    const rowRoles = roles.slice(i, i + 5);

    rows.push(
      new ActionRowBuilder().addComponents(
        rowRoles.map(role => {
          const button = new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.name)
            .setStyle(ButtonStyle.Secondary);

          // Optional emoji support in constants.js
          if (role.emoji) {
            button.setEmoji(role.emoji);
          }

          return button;
        })
      )
    );
  }

  return rows;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post all Haven self-role panels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.reply({
      content: "✅ Posting the new self-role panels...",
      ephemeral: true
    });

    /*
     * Put your banner image here:
     *
     * src/assets/roles-banner.png
     *
     * Change the path below if your assets folder is elsewhere.
     */
    const bannerPath = path.join(
      __dirname,
      "../assets/roles-banner.png"
    );

    const banner = new AttachmentBuilder(bannerPath);

    await interaction.channel.send({
      files: [banner]
    });

    const panels = [
      {
        group: "age",
        content:
          "˖ ࣪ ⊹ **age roles** ୨୧ ˖\n" +
          "⊹ choose your age range."
      },
      {
        group: "gender",
        content:
          "˖ ࣪ ⊹ **gender roles** ୨୧ ˖\n" +
          "⊹ choose your gender role."
      },
      {
        group: "pronouns",
        content:
          "˖ ࣪ ⊹ **pronoun roles** ୨୧ ˖\n" +
          "⊹ choose your pronouns."
      },
      {
        group: "sexuality",
        content:
          "˖ ࣪ ⊹ **sexuality roles** ୨୧ ˖\n" +
          "⊹ choose your sexuality role."
      },
      {
        group: "relationship",
        content:
          "˖ ࣪ ⊹ **relationship roles** ୨୧ ˖\n" +
          "⊹ choose your relationship status."
      },
      {
        group: "location",
        content:
          "˖ ࣪ ⊹ **location roles** ୨୧ ˖\n" +
          "⊹ choose where you're from."
      },
      {
        group: "dms",
        content:
          "˖ ࣪ ⊹ **dm preference** ୨୧ ˖\n" +
          "⊹ let people know if they can message you."
      },
      {
        group: "interest",
        content:
          "˖ ࣪ ⊹ **interest roles** ୨୧ ˖\n" +
          "⊹ choose anything you're interested in."
      },
      {
        group: "game",
        content:
          "˖ ࣪ ⊹ **gaming roles** ୨୧ ˖\n" +
          "⊹ choose the games and platforms you play."
      },
      {
        group: "separator",
        content:
          "˖ ࣪ ⊹ **role separators** ୨୧ ˖\n" +
          "⊹ decorate and organise your profile."
      }
    ];

    for (const panel of panels) {
      const rows = createRows(panel.group);

      // Skip categories that currently have no roles
      if (rows.length === 0) {
        console.log(
          `Skipping self-role group "${panel.group}" because it has no roles.`
        );

        continue;
      }

      await interaction.channel.send({
        content: panel.content,
        components: rows
      });
    }

    await interaction.editReply({
      content: "✅ The new self-role panels have been posted."
    });
  }
};
