const { OPTIONAL_PINGS } = require("../config/constants");
const { findRole } = require("../utils/finders");

async function toggleOptionalPing(interaction) {
  onst OPTIONAL_PINGS = [
  {
    id: "ping_chat_revive",
    name: "💗 Chat Revive"
  },
  {
    id: "ping_vc_revive",
    name: "🎙️ VC Revive"
  },
  {
    id: "ping_daily_question",
    name: "❓ Daily Question"
  },
  {
    id: "ping_announcement",
    name: "📢 Announcement Ping"
  },
  {
    id: "ping_bump_reminder",
    name: "🚀 Bump Reminder"
  }
];

  if (!selectedPing) return;

  const selectedRole = findRole(interaction.guild, selectedPing.name);

  if (!selectedRole) {
    return interaction.reply({
      content: "That notification role does not exist yet. Ask staff to run `/setup-optional-pings`.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(selectedRole.id)) {
    await interaction.member.roles.remove(selectedRole);

    return interaction.reply({
      content: `Removed ${selectedPing.name}.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(selectedRole);

  return interaction.reply({
    content: `Added ${selectedPing.name}.`,
    ephemeral: true
  });
}

module.exports = {
  toggleOptionalPing
};
