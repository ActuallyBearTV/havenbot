require("dotenv").config();

const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const setupSelfRoles = require("./src/commands/setupSelfRoles");
const { toggleSelfRole } = require("./src/buttons/selfRoles");

const banCommand = require("./src/commands/ban");
const kickCommand = require("./src/commands/kick");
const timeoutCommand = require("./src/commands/timeout");
const slowmodeCommand = require("./src/commands/slowmode");
const unlockCommand = require("./src/commands/unlock");
const lockCommand = require("./src/commands/lock");
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
    
    if (interaction.isButton()) {

  if (
    interaction.customId === "verify_member" ||
    interaction.customId === "verify_button" ||
    interaction.customId === "verify" ||
    interaction.customId === "haven_verify"
  ) {
    return verifyMember(interaction);
  }

  if (interaction.customId === "open_ticket") {
    return ticketCommand.execute(interaction);
  }

  if (interaction.customId.startsWith("colour_")) {
    return toggleColourRole(interaction);
  }

  if (interaction.customId.startsWith("ping_")) {
    return toggleOptionalPing(interaction);
  }

  // 👇 ADD THIS HERE

  if (
    interaction.customId.startsWith("gender_") ||
    interaction.customId.startsWith("age_") ||
    interaction.customId.startsWith("location_") ||
    interaction.customId.startsWith("interest_")
  ) {
    return toggleSelfRole(interaction);
  }
}
    }

   if (interaction.isChatInputCommand()) {
  if (interaction.commandName === "setup-self-roles") return setupSelfRoles.execute(interaction);

  if (interaction.commandName === "ban") return banCommand.execute(interaction);
  if (interaction.commandName === "kick") return kickCommand.execute(interaction);
  if (interaction.commandName === "timeout") return timeoutCommand.execute(interaction);
  if (interaction.commandName === "slowmode") return slowmodeCommand.execute(interaction);
  if (interaction.commandName === "unlock") return unlockCommand.execute(interaction);
  if (interaction.commandName === "lock") return lockCommand.execute(interaction);
  if (interaction.commandName === "purge") return purgeCommand.execute(interaction);
      if (interaction.commandName === "setup-colour-roles") return setupColourRoles.execute(interaction);
      if (interaction.commandName === "setup-optional-pings") return setupOptionalPings.execute(interaction);
      if (interaction.commandName === "post-custom") return postCustom.execute(interaction);
      if (interaction.commandName === "verify") return verifyCommand.execute(interaction);
      if (interaction.commandName === "ticket") return ticketCommand.execute(interaction);
      if (interaction.commandName === "close-ticket") return closeTicketCommand.execute(interaction);
      if (interaction.commandName === "setup-ticket-panel") return setupTicketPanel.execute(interaction);

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
