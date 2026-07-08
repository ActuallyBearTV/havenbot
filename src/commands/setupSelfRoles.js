const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const { SELF_ROLES } = require("../config/constants");

function createRows(group) {
  const roles = SELF_ROLES.filter(role => role.group === group);
  const rows = [];

  for (let i = 0; i < roles.length; i += 5) {
    rows.push(
      new ActionRowBuilder().addComponents(
        roles.slice(i, i + 5).map(role =>
          new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.name)
            .setStyle(ButtonStyle.Secondary)
        )
      )
    );
  }

  return rows;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post all Haven self role panels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const panels = [
      {
        group: "age",
        title: "🔞 Age Roles",
        description: "Choose your age range."
      },
      {
        group: "gender",
        title: "⚧️ Gender Roles",
        description: "Choose your gender role."
      },
      {
        group: "pronouns",
        title: "💬 Pronoun Roles",
        description: "Choose your pronouns."
      },
      {
        group: "sexuality",
        title: "🏳️‍🌈 Sexuality Roles",
        description: "Choose your sexuality role."
      },
      {
        group: "location",
        title: "🌍 Location Roles",
        description: "Choose your location."
      },
      {
        group: "relationship",
        title: "💞 Relationship Status",
        description: "Choose your relationship status."
      },
      {
        group: "dms",
        title: "📩 DM Status",
        description: "Let people know if they can DM you."
      },
      {
        group: "interest",
        title: "🎨 Interest Roles",
        description: "Choose any interests that apply to you."
      },
      {
        group: "game",
        title: "🎮 Gaming Roles",
        description: "Choose the games/platforms you play."
      }
    ];

    await interaction.reply({
      content: "✅ Self role panels posted.",
      ephemeral: true
    });

    for (const panel of panels) {
      const embed = new EmbedBuilder()
        .setColor("#F472B6")
        .setTitle(panel.title)
        .setDescription(panel.description);

      await interaction.channel.send({
        embeds: [embed],
        components: createRows(panel.group)
      });
    }
  }
};
