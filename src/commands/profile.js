const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { getRank, getUserPosition, xpNeeded } = require("../features/levels");

async function execute(interaction) {
  await interaction.deferReply();

  const target = interaction.options.getUser("user") || interaction.user;
  const stats = getRank(interaction.guild.id, target.id);
  const position = getUserPosition(interaction.guild.id, target.id);
  const needed = xpNeeded(stats.level);
  const percent = Math.min(stats.xp / needed, 1);

  const canvas = createCanvas(900, 300);
  const ctx = canvas.getContext("2d");

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 900, 300);
  gradient.addColorStop(0, "#15152B");
  gradient.addColorStop(1, "#7C3AED");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 300);

  // Card panel
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  roundRect(ctx, 25, 25, 850, 250, 28);
  ctx.fill();

  // Avatar
  const avatar = await loadImage(
    target.displayAvatarURL({ extension: "png", size: 256 })
  );

  ctx.save();
  ctx.beginPath();
  ctx.arc(150, 150, 85, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 65, 65, 170, 170);
  ctx.restore();

  // Text
  ctx.fillStyle = "#FFFFFF";

  ctx.font = "bold 42px sans-serif";
  ctx.fillText(target.username, 270, 95);

  ctx.font = "28px sans-serif";
  ctx.fillText(`Rank #${position || "Unranked"}`, 270, 145);
  ctx.fillText(`Level ${stats.level}`, 270, 185);
  ctx.fillText(`${stats.xp} / ${needed} XP`, 270, 225);

  // Progress bar background
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  roundRect(ctx, 270, 240, 520, 28, 14);
  ctx.fill();

  // Progress bar fill
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 270, 240, 520 * percent, 28, 14);
  ctx.fill();

  // Footer
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(`Messages counted: ${stats.messages}`, 270, 278);

  const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
    name: "profile.png"
  });

  return interaction.editReply({ files: [attachment] });
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = { execute };
