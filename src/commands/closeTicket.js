module.exports = {
  name: "close-ticket",

  async execute(interaction) {
    if (!interaction.channel.name.startsWith("ticket-")) {
      return interaction.reply({
        content: "This command can only be used inside a ticket channel.",
        ephemeral: true
      });
    }

    await interaction.reply("Closing this ticket in 5 seconds...");

    setTimeout(() => {
      interaction.channel.delete("Ticket closed").catch(console.error);
    }, 5000);
  }
};
