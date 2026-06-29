require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const postCustom = require("./src/commands/postCustom");
const setupOptionalPings = require("./src/commands/setupOptionalPings");
const { havenEmbed } = require("./src/utils/embed");
const { findChannel, findRole } = require("./src/utils/finders");
const { COLOUR_ROLES, OPTIONAL_PINGS } = require("./src/config/constants");
const { toggleColourRole } = require("./src/buttons/colourRoles");
const { toggleOptionalPing } = require("./src/buttons/optionalPings");
const verifyCommand = require("./src/commands/verify");
const setupColourRoles = require("./src/commands/setupColourRoles");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("colour_")) {
        return toggleColourRole(interaction);
      }

      if (interaction.customId.startsWith("ping_")) {
        return toggleOptionalPing(interaction);
      }
    }

    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "setup-colour-roles") {
        return setupColourRoles.execute(interaction);
      }
if (interaction.commandName === "setup-optional-pings") {
    return setupOptionalPings.execute(interaction);
}

      

        const modal = new ModalBuilder()
          .setCustomId("haven_custom_announcement_modal")
          .setTitle("Haven Announcement");

        const titleInput = new TextInputBuilder()
          .setCustomId("announcement_title")
          .setLabel("Announcement Title")
          .setPlaceholder("Example: Colour Roles Are Live!")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100);

        const messageInput = new TextInputBuilder()
          .setCustomId("announcement_message")
          .setLabel("Announcement Message")
          .setPlaceholder("Type what you want the bot to say...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(titleInput),
          new ActionRowBuilder().addComponents(messageInput)
        );

        return interaction.showModal(modal);
      }

      if (interaction.commandName === "verify") {
        return verifyCommand.execute(interaction);
      }

      return interaction.reply({
        content: "This command is installed, but this feature has not been connected yet.",
        ephemeral: true
      });
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId !== "haven_custom_announcement_modal") return;

      const title = interaction.fields.getTextInputValue("announcement_title");
      const message = interaction.fields.getTextInputValue("announcement_message");

      await interaction.channel.send({
        embeds: [havenEmbed(`📢 ${title}`, message)]
      });

      return interaction.reply({
        content: "Announcement posted.",
        ephemeral: true
      });
    }
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({
        content: "Something went wrong. Check the bot logs.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content: "Something went wrong. Check the bot logs.",
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
