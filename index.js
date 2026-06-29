require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

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
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "verify":
      await interaction.reply({
        content: "✅ Haven Bot is online!",
        ephemeral: true
      });
      break;

    default:
      await interaction.reply({
        content: "This command is installed but hasn't been connected yet.",
        ephemeral: true
      });
  }
});

client.login(process.env.DISCORD_TOKEN);
