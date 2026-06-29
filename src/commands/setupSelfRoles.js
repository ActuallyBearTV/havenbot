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
    .setDescription("Post the gender, age, location, and interest role panels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const panels = [
      {
        group: "gender",
        title: "⚧️ Gender Roles",
        description: "Choose your gender role."
      },
      {
        group: "age",
        title: "🔞 Age Roles",
        description: "Choose your age role."
      },
      {
        group: "location",
        title: "🌍 Location Roles",
        description: "Choose your location role."
      },
      {
        group: "interest",
        title: "🎮 Interest Roles",
        description: "Choose any interests that apply to you."
      }
    ];

    await interaction.reply({
      content: "✅ Self role panels posted.",
      ephemeral: true
    });

    for (const panel of panels) {
      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(panel.title)
        .setDescription(panel.description);

      await interaction.channel.send({
        embeds: [embed],
        components: createRows(panel.group)
      });
    }
  }
};
