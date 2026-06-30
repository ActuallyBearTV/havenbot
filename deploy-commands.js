require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [ 
  new SlashCommandBuilder()
  .setName("setuplevelrewards")
  .setDescription("Create Haven level reward roles."),
  new SlashCommandBuilder()
  .setName("rank")
  .setDescription("View your Haven level rank.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The member to check")
      .setRequired(false)
  ),

new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("View the Haven XP leaderboard."),
  new SlashCommandBuilder()
  .setName("removewarn")
  .setDescription("Remove a specific warning from a member.")
  .addUserOption(option =>
    option.setName("user").setDescription("The member").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("warning-id").setDescription("The warning ID to remove").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
  .setName("warnings")
  .setDescription("View a member's warnings.")
  .addUserOption(option =>
    option.setName("user").setDescription("The member to check").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Warn a member.")
  .addUserOption(option =>
    option.setName("user").setDescription("The member to warn").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("reason").setDescription("Reason for the warning").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
  .setName("setup-self-roles")
  .setDescription("Post the gender, age, location, and interest role panels.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a member from the server.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The member to ban")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("reason")
      .setDescription("Reason for the ban")
      .setRequired(false)
  )
  .addIntegerOption(option =>
    option
      .setName("delete-days")
      .setDescription("Delete their messages from the last 0-7 days")
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(7)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a member from the server.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The member to kick")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("reason")
      .setDescription("Reason for the kick")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a member.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The member to timeout")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("duration")
      .setDescription("Duration: 10s, 5m, 1h, 1d")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("reason")
      .setDescription("Reason for the timeout")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
  .setName("slowmode")
  .setDescription("Set slowmode for this channel.")
  .addIntegerOption(option =>
    option
      .setName("seconds")
      .setDescription("Slowmode in seconds. Use 0 to disable.")
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(21600)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock this channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder()
  .setName("lock")
  .setDescription("Lock this channel so members cannot send messages.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("setup-ticket-panel").setDescription("Post the Haven ticket panel.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("install-haven").setDescription("Install Haven server setup.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("setup-colour-roles").setDescription("Create colour roles and button menu.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("setup-optional-pings").setDescription("Create optional ping roles and menu.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("verify").setDescription("Verify yourself."),
  new SlashCommandBuilder().setName("ticket").setDescription("Open a support ticket."),
  new SlashCommandBuilder().setName("close-ticket").setDescription("Close this ticket.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Delete a number of messages from this channel.")
  .addIntegerOption(option =>
    option
      .setName("amount")
      .setDescription("Number of messages to delete")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("post-custom").setDescription("Open a popup form to post a custom announcement.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("post-update").setDescription("Post the default Haven update.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("revive-chat").setDescription("Ping Chat Revive.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("revive-vc").setDescription("Ping VC Revive.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("daily-question").setDescription("Post a daily question.").addStringOption(o=>o.setName("question").setDescription("Question").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("giveaway").setDescription("Create a simple giveaway.").addStringOption(o=>o.setName("prize").setDescription("Prize").setRequired(true)).addStringOption(o=>o.setName("duration").setDescription("Duration").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("timeout-user").setDescription("Timeout a member.").addUserOption(o=>o.setName("user").setDescription("User").setRequired(true)).addIntegerOption(o=>o.setName("minutes").setDescription("Minutes").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("Reason")).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
].map(c=>c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async()=>{
  try{
    console.log("Deploying slash commands...");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    console.log("Slash commands deployed.");
  }catch(e){ console.error(e); }
})();
