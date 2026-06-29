require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [
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
