const { PermissionFlagsBits } = require("discord.js");

const staffRoleIds = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

function hasStaffPermission(interaction) {
  return (
    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    interaction.member.roles.cache.some(role => staffRoleIds.includes(role.id))
  );
}

module.exports = {
  staffRoleIds,
  hasStaffPermission
};
