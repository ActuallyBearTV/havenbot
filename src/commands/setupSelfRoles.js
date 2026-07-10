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
  const roles = SELF_ROLES.filter(
    role => role.group === group
  );

  const rows = [];

  for (let i = 0; i < roles.length; i += 5) {
    const row = new ActionRowBuilder();

    const rowRoles = roles.slice(i, i + 5);

    for (const role of rowRoles) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(
  role.name
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .toLowerCase()
)
          .setStyle(ButtonStyle.Secondary)
      );
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post all Haven self-role panels.")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    await interaction.reply({
      content: "Setting up the self-role panels...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      // Delete old self-role panels posted by the bot
      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        return (
          message.author.id === interaction.client.user.id &&
          (
            message.content.includes("**age roles**") ||
            message.content.includes("**gender roles**") ||
            message.content.includes("**pronoun roles**") ||
            message.content.includes("**sexuality roles**") ||
            message.content.includes("**relationship roles**") ||
            message.content.includes("**location roles**") ||
            message.content.includes("**dm preference**") ||
            message.content.includes("**interest roles**") ||
            message.content.includes("**gaming roles**") ||
            message.content.includes("**role separators**")
          )
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old self-role panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      // Post the banner
      const bannerPath = path.join(
        __dirname,
        "../assets/roles-banner.png"
      );

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
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

        if (rows.length === 0) {
          continue;
        }

        await channel.send({
          content: panel.content,
          components: rows
        });
      }

      await interaction.editReply({
        content: `✅ Self-role panels posted in ${channel}.`
      });
    } catch (error) {
      console.error("Self-role setup error:", error);

      await interaction.editReply({
        content: `❌ Self-role setup failed: ${error.message}`
      });
    }
  }
};
