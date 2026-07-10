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
            :purple_moon:  We're an adult server, aiming to create a safe environment for adults to make genuine friendships and be part of a welcoming community. Please make sure to read the rules.

:Yumii_008whiterollstar:1. Be respectful to everyone in chat and vc. (including staff)
๑ If someone asks you to stop talking about a topic please respect their wishes.
๑ No body shaming, bullying, sexism, homophobia or any other form of discrimination will be tolerated.

:Yumii_008whiterollstar:2. No slurs/derogatory remarks.
๑ They have been blocked off by a bot, please don't try to bypass them.
๑ Bypassing them will result in a warning.

:Yumii_008whiterollstar:3. No names, users, pronoun names, banners, pfps, statuses that might be offensive. Failure to change these upon request will result in a removal from the server.

:Yumii_008whiterollstar:4. Don’t make fun of or talk badly of anyone based on their beliefs, race, religion or appearance.

:Yumii_008whiterollstar:5. No minors in the server.
๑ This is an 18+ server, if you suspect someone isn’t of age please let a staff member know.

:Yumii_008whiterollstar:6. Harassment, doxing, blackmailing, stalking or unrequested inappropriate dms will result in a ban.
๑ Don’t leak/share anyone’s personal information or pictures they send you privately.
๑ Don’t go looking for any members’ information if they haven’t shared it with you.
๑ Unrequested dms include sexual/sensitive pictures or messages you specifically did not say yes to or agreed to receive. (must show evidence)

:Yumii_008whiterollstar:7. No jokes about racism, racial stereotypes, rape, suicide, self-harm, pedo, disturbing or sensitive topics.

:Yumii_008whiterollstar:8. Don’t bring up politics, controversial/sensitive topics.
๑ This includes but isn't limited to killing, hard drugs, suicide, abuse, abortion and rape.
๑ If you’d like to vent please use the mental health channel and add spoilers to any triggering words.

:Yumii_008whiterollstar:9. No images, links or videos containing nudity, sexual activity, scam tactics or violence in any of the chats.

:Yumii_008whiterollstar:10. No drama. Don’t bring your issues to the server and solve them in private.
๑ If someone unadds you/blocks you, don’t bring it up to the server.
๑ We also won't be dealing with situations that happen outside of the server, for example in group chats or other servers, for our own sanity. We can only control and deal with what happens inside of this server.
๑ Arguments/disagreements are normal, but don’t get disrespectful or continue to bring up an issue multiple times. If this happens you will be asked to stop, If it continues you will be warned or put in timeout.
๑ Don't share/stream private dms in the server.

:Yumii_008whiterollstar:11. No nsfw content.
๑ Small talk or jokes that don’t offend others are okay.

:Yumii_008whiterollstar: 12. No promotions of other servers or invites. We only allow this if you've partnered up with us.
๑ Don’t advertise other servers in any of the channels. This will result in you getting kicked off the server. 

˗ˏˋ ꒰ Warnings/Timeouts/Bans/Appeals ꒱ ˎˊ˗
:Yumii_008whiterollstar:Strike system:
๑ 2 warnings before kicking out
๑ Kick/Ban

:Yumii_008whiterollstar:Timeouts: Causing drama or talking about a topic after being asked to stop, will result in you being muted.

:Yumii_008whiterollstar:Kicks: We will kick anyone who is problematic, wants to bring drama, advertises other servers through dms, causes issues to other members and breaks the rules.

:Yumii_008whiterollstar:Automatic Bans: Hate speech and imagery, racist comments, threats, trolls, scamming in server or dms, unwanted predatory behaviour (with evidence) and inappropriate behavior with minors.
(Staff will not be dealing with anyone being childish, rude, problematic or unreasonable in dms after being banned).

:Yumii_008whiterollstar:Appeals:
๑ Warnings: Open a ticket in the ticket channel.
๑ Kicks: Open a ticket in the ticket channel.
๑ Timeouts: contact a staff member.
๑ Bans: contact a staff member. (Bans for discord ToS violations cannot be appealed).

╭₊˚๑ boost perks : ₊˚੭
:Yumii_008whiterollstar:booster icon
:Yumii_008whiterollstar:customisable role (pick your own role name, colour, icon)
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
