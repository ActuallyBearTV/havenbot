async function execute(interaction) {
  return interaction.reply({
    content: "✅ Haven Bot is online and working!",
    ephemeral: true
  });
}

module.exports = {
  execute
};
