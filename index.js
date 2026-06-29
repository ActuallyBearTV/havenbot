require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits
} = require("discord.js");

const customAnnouncementModal = require("./src/modals/customAnnouncement");
const { havenEmbed } = require("./src/utils/embed");
const { toggleColourRole } = require("./src/buttons/colourRoles");
const { toggleOptionalPing } = require("./src/buttons/optionalPings");

const verifyCommand = require("./src/commands/verify");
const setupColourRoles = require("./src/commands/setupColourRoles");
const setupOptionalPings = require("./src/commands/setupOptionalPings");
const postCustom = require("./src/commands/postCustom");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
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

      if (interaction.commandName === "post-custom") {
        return postCustom.execute(interaction);
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
  if (interaction.customId === customAnnouncementModal.customId) {
    return customAnnouncementModal.execute(interaction);
  }
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
