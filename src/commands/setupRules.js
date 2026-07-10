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
          (
            description.includes("we're an adult server") ||
            description.includes("warnings, timeouts, bans and appeals") ||
            description.includes("boost perks")
          )
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
            "<:purple_moon:1523984549632016414> **we're an adult server**, aiming to create a safe environment for adults to make genuine friendships and be part of a welcoming community. please make sure to read the rules.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **1. be respectful to everyone in chat and vc, including staff.**",
            "๑ if someone asks you to stop talking about a topic, please respect their wishes.",
            "๑ no body shaming, bullying, sexism, homophobia or any other form of discrimination will be tolerated.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **2. no slurs or derogatory remarks.**",
            "๑ they have been blocked by the bot, so please don't try to bypass them.",
            "๑ bypassing them will result in a warning.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **3. keep profiles appropriate.**",
            "names, usernames, pronoun names, banners, profile pictures and statuses must not be offensive. failure to change them when requested may result in removal from the server.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **4. respect people's beliefs and identity.**",
            "don't make fun of or talk badly about anyone based on their beliefs, race, religion or appearance.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **5. no minors in the server.**",
            "๑ this is an 18+ server. if you suspect someone is underage, let a staff member know.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **6. harassment and privacy violations are forbidden.**",
            "harassment, doxxing, blackmailing, stalking or unrequested inappropriate dms will result in a ban.",
            "๑ don't leak or share anyone's personal information or pictures they sent privately.",
            "๑ don't go looking for members' information if they haven't shared it.",
            "๑ unwanted dms include sexual or sensitive images or messages the recipient did not agree to receive. evidence must be provided.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **7. no jokes about disturbing or sensitive subjects.**",
            "this includes racism, racial stereotypes, rape, suicide, self-harm, paedophilia and similar topics.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **8. avoid politics and controversial topics.**",
            "๑ this includes killing, hard drugs, suicide, abuse, abortion and rape.",
            "๑ use the mental health channel for venting and add spoilers to triggering words.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **9. no unsafe content.**",
            "do not post images, links or videos containing nudity, sexual activity, scams or graphic violence.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **10. no drama.**",
            "keep personal issues private.",
            "๑ if someone blocks or removes you, don't bring it into the server.",
            "๑ staff will only deal with incidents that happen inside haven.",
            "๑ disagreements are normal, but do not become disrespectful or repeatedly restart arguments.",
            "๑ don't share or stream private dms in the server.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **11. no nsfw content.**",
            "๑ small jokes are fine provided they do not offend others, but explicit content is not allowed.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **12. no server promotions or invites.**",
            "advertising is only allowed for official partners.",
            "๑ advertising other servers may result in removal from haven.",
            "",
            "˗ˏˋ ꒰ **warnings, timeouts, bans and appeals** ꒱ ˎˊ˗",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **strike system**",
            "๑ two warnings may lead to a kick.",
            "๑ severe behaviour may result in an immediate kick or ban.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **timeouts**",
            "causing drama or continuing a topic after being asked to stop may result in a timeout.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **kicks**",
            "members may be kicked for repeated drama, advertising, harassment, causing issues or repeatedly breaking rules.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **automatic bans**",
            "hate speech or imagery, racist comments, threats, trolling, scamming, predatory behaviour and inappropriate behaviour involving minors may result in an immediate ban.",
            "",
            "<a:Yumii_008whiterollstar:1525122138779156580> **appeals**",
            "๑ warnings: open a ticket.",
            "๑ kicks: open a ticket.",
            "๑ timeouts: contact a staff member.",
            "๑ bans: contact a staff member. bans for discord tos violations cannot be appealed.",
            "",
            "╭₊˚๑ **boost perks** ₊˚੭",
            "๑ booster icon",
            "๑ customisable role with your own name, colour and icon"
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
