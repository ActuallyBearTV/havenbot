const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

GlobalFonts.registerFromPath(
  path.join(__dirname, "../assets/fonts/Inter-Bold.ttf"),
  "Inter"
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Create a quote image and post it in #quotes")
    .addStringOption(option =>
      option
        .setName("quote")
        .setDescription("The quote text")
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The person being quoted")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const quote = interaction.options.getString("quote");
    const quotedUser = interaction.options.getUser("user") || interaction.user;

    const quotesChannel = interaction.guild.channels.cache.find(
      channel => channel.name === "quotes" && channel.isTextBased()
    );

    if (!quotesChannel) {
      return interaction.editReply("I couldn't find a `#quotes` channel.");
    }

    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext("2d");

    const avatarURL = quotedUser.displayAvatarURL({
      extension: "png",
      size: 1024
    });

    const avatar = await loadImage(avatarURL);

    // Background
    ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quote marks
    ctx.font = "90px Inter";
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillText("“", 70, 140);

    // Quote text
    ctx.font = "46px Inter";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    wrapText(ctx, quote, canvas.width / 2, 260, 800, 60);

    // Author
    ctx.font = "32px Inter";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText(`— ${quotedUser.username}`, canvas.width / 2, 500);

    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
      name: "quote.png"
    });

    await quotesChannel.send({
      content: `Quote submitted by ${interaction.user}`,
      files: [attachment]
    });

    await interaction.editReply("Quote posted in #quotes.");
  }
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}
