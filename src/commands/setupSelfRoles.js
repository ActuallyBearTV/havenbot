const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder
} = require("discord.js");

const path = require("path");
const { SELF_ROLES } = require("../config/constants");

function getEmojiDisplay(emoji) {
  if (!emoji) return "❔";

  // Supports normal Unicode emojis
  if (!emoji.includes(":")) {
    return emoji;
  }

  // Supports custom emoji strings such as:
  // <:pinkheart:123456789012345678>
  return emoji;
}

function getReactionEmoji(emoji) {
  if (!emoji) return null;

  // Converts a custom emoji string into its ID for message.react()
  const customEmojiMatch = emoji.match(/<a?:\w+:(\d+)>/);

  if (customEmojiMatch) {
    return customEmojiMatch[1];
  }

  return emoji;
}

function createRoleList(group) {
  const roles = SELF_ROLES.filter(role => role.group === group);

  return roles
    .map(role => `${getEmojiDisplay(role.emoji)}  **${role.name}**`)
    .join("\n");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post all Haven reaction-role panels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.reply({
      content: "✅ Posting the reaction-role panels...",
      ephemeral: true
    });

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
        title: "˖ ࣪ ⊹ **age roles** ୨୧ ˖",
        description: "⊹ choose your age range."
      },
      {
        group: "gender",
        title: "˖ ࣪ ⊹ **gender roles** ୨୧ ˖",
        description: "⊹ choose your gender role."
      },
      {
        group: "pronouns",
        title: "˖ ࣪ ⊹ **pronoun roles** ୨୧ ˖",
        description: "⊹ choose your pronouns."
      },
      {
        group: "sexuality",
        title: "˖ ࣪ ⊹ **sexuality roles** ୨୧ ˖",
        description: "⊹ choose your sexuality role."
      },
      {
        group: "relationship",
        title: "˖ ࣪ ⊹ **relationship roles** ୨୧ ˖",
        description: "⊹ choose your relationship status."
      },
      {
        group: "location",
        title: "˖ ࣪ ⊹ **location roles** ୨୧ ˖",
        description: "⊹ choose where you're from."
      },
      {
        group: "dms",
        title: "˖ ࣪ ⊹ **dm preference** ୨୧ ˖",
        description: "⊹ let people know if they can message you."
      },
      {
        group: "interest",
        title: "˖ ࣪ ⊹ **interest roles** ୨୧ ˖",
        description: "⊹ choose anything you're interested in."
      },
      {
        group: "game",
        title: "˖ ࣪ ⊹ **gaming roles** ୨୧ ˖",
        description: "⊹ choose the games and platforms you play."
      },
      {
        group: "separator",
        title: "˖ ࣪ ⊹ **role separators** ୨୧ ˖",
        description: "⊹ decorate and organise your profile."
      }
    ];

    for (const panel of panels) {
      const roles = SELF_ROLES.filter(
        role => role.group === panel.group
      );

      if (roles.length === 0) {
        continue;
      }

      const message = await interaction.channel.send({
        content: [
          panel.title,
          panel.description,
          "",
          createRoleList(panel.group)
        ].join("\n")
      });

      for (const role of roles) {
        const reactionEmoji = getReactionEmoji(role.emoji);

        if (!reactionEmoji) {
          console.warn(
            `No emoji configured for reaction role: ${role.name}`
          );

          continue;
        }

        try {
          await message.react(reactionEmoji);
        } catch (error) {
          console.error(
            `Could not react with emoji for ${role.name}:`,
            error
          );
        }
      }
    }

    await interaction.editReply({
      content: "✅ The reaction-role panels have been posted."
    });
  }
};
