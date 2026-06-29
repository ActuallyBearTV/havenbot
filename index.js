require("dotenv").config();

const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const purgeCommand = require("./src/commands/purge");
const { verifyMember } = require("./src/buttons/verify");
const { sendWelcome } = require("./src/features/welcome");
const { sendStaffLog } = require("./src/utils/staffLogs");
const setupTicketPanel = require("./src/commands/setupTicketPanel");
const ticketCommand = require("./src/commands/ticket");
const closeTicketCommand = require("./src/commands/closeTicket");
const customAnnouncementModal = require("./src/modals/customAnnouncement");
const { toggleColourRole } = require("./src/buttons/colourRoles");
const { toggleOptionalPing } = require("./src/buttons/optionalPings");

const verifyCommand = require("./src/commands/verify");
const setupColourRoles = require("./src/commands/setupColourRoles");
const setupOptionalPings = require("./src/commands/setupOptionalPings");
const postCustom = require("./src/commands/postCustom");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  try {
    // all your button, command, and modal code here

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
    if (interaction.isModalSubmit()) {
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

client.on("guildMemberAdd", async member => {
  console.log(`✅ JOIN EVENT: ${member.user.tag}`);

  await sendStaffLog(member.guild, {
    title: "📥 Member Joined",
    description: `${member} joined the server.`,
    user: member.user,
    extra:
      `📅 **Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
      `⏳ **Account Age:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n` +
      `👥 **Member Count:** ${member.guild.memberCount}`,
    color: "#22C55E"
  });

  await sendWelcome(member);
});

client.on("guildMemberRemove", async member => {
  await sendStaffLog(member.guild, {
    title: "📤 Member Left",
    description: `${member.user.tag} left the server.`,
    user: member.user,
    extra:
      `📅 **Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
      `⏳ **Account Age:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n` +
      `👥 **Member Count:** ${member.guild.memberCount}`,
    color: "#EF4444"
  });
});

client.login(process.env.DISCORD_TOKEN);
