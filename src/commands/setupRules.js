const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-rules")
    .setDescription("Post the Haven rules panel.")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    await interaction.reply({
      content: "Setting up the rules panel...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        const description =
          message.embeds[0]?.description || message.content;

        return (
          message.author.id === interaction.client.user.id &&
          description.includes("**server rules**")
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old rules panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const bannerPath = path.join(
        __dirname,
        "../assets/rules-banner.png"
      );

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
        files: [banner]
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.client.user.username,
          iconURL:
            interaction.client.user.displayAvatarURL()
        })
        .setDescription(
          [
            "˖ ࣪ ⊹ **server rules** ୨୧ ˖",
            "⊹ please read and follow all rules.",
            "",
            "**1. be respectful**",
            "treat everyone with kindness. harassment, bullying, discrimination, or hate speech is not allowed.",
            "",
            "**2. keep content appropriate**",
            "do not post sexual, graphic, disturbing, or otherwise inappropriate content.",
            "",
            "**3. no spam**",
            "avoid message spam, excessive mentions, emoji spam, repeated images, or disruptive behaviour.",
            "",
            "**4. no advertising**",
            "do not advertise servers, social media, products, or services without staff permission.",
            "",
            "**5. protect personal information**",
            "do not share private information belonging to yourself or anyone else.",
            "",
            "**6. use channels correctly**",
            "keep conversations relevant to each channel and follow any channel-specific guidance.",
            "",
            "**7. no unnecessary drama**",
            "keep personal disputes out of public channels. contact staff if support is needed.",
            "",
            "**8. follow staff instructions**",
            "staff decisions should be respected. concerns can be raised calmly through the correct support channel.",
            "",
            "**9. follow discord's rules**",
            "all members must follow discord's terms of service and community guidelines.",
            "",
            "**10. use common sense**",
            "not every situation can be listed. behaviour that harms the community may still be moderated.",
            "",
            "⊹ rules may be updated when needed.",
            "⊹ claiming not to have read the rules is not an excuse."
          ].join("\n")
        )
        .setColor("#2B0B3F");

      await channel.send({
        embeds: [embed]
      });

      await interaction.editReply({
        content: `✅ Rules panel posted in ${channel}.`
      });
    } catch (error) {
      console.error("Rules setup error:", error);

      await interaction.editReply({
        content: `❌ Rules setup failed: ${error.message}`
      });
    }
  }
};
