require("dotenv").config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("install-haven")
    .setDescription("Install Haven server setup.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("setup-colour-roles")
    .setDescription("Create colour roles and button menu.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("setup-optional-pings")
    .setDescription("Create optional ping roles and menu.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify yourself."),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Open a support ticket."),

  new SlashCommandBuilder()
    .setName("close-ticket")
    .setDescription("Close this ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("post-custom")
    .setDescription("Open a popup form to post a custom announcement.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("post-update")
    .setDescription("Post the default Haven update.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("revive-chat")
    .setDescription("Ping Chat Revive.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("revive-vc")
    .setDescription("Ping VC Revive.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("daily-question")
    .setDescription("Post a daily question.")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Question")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a giveaway.")
    .addStringOption(option =>
      option.setName("prize")
        .setDescription("Prize")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration")
        .setDescription("Duration")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("timeout-user")
    .setDescription("Timeout a member.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutes")
        .setDescription("Minutes")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Deploying slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("Slash commands deployed.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
