module.exports = {
  name: "close-ticket",

  const { sendLog } = require("../utils/logs");
  async execute(interaction) {
    if (!interaction.channel.name.startsWith("ticket-")) {
      return interaction.reply({
        content: "This command can only be used inside a ticket channel.",
        ephemeral: true
      });
    }

    await interaction.reply({
  content: "🔒 Closing ticket in 5 seconds..."
});

await sendLog(
  interaction.guild,
  "🔒 Ticket Closed",
  `${interaction.user} closed ${interaction.channel}`,
  "#EF4444"
);

setTimeout(() => {
  interaction.channel.delete();
}, 5000);
