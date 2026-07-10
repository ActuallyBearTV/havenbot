const { COLOUR_ROLES } = require("../config/constants");

function getConfiguredEmojiId(emoji) {
  if (!emoji) return null;

  const match = emoji.match(/<a?:\w+:(\d+)>/);

  return match ? match[1] : emoji;
}

function getReactionEmojiId(reaction) {
  return reaction.emoji.id || reaction.emoji.name;
}

async function prepareReaction(reaction) {
  try {
    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.message.partial) {
      await reaction.message.fetch();
    }

    return true;
  } catch (error) {
    console.error("Failed to fetch reaction:", error);
    return false;
  }
}

function findColourFromReaction(reaction) {
  const emojiId = getReactionEmojiId(reaction);

  return COLOUR_ROLES.find(colour => {
    return getConfiguredEmojiId(colour.emoji) === emojiId;
  });
}

function isColourRoleMessage(reaction) {
  const message = reaction.message;

  return (
    message.guild &&
    message.author?.id === message.client.user.id &&
    message.content.includes("**colour roles**")
  );
}

async function handleColourReactionAdd(reaction, user) {
  if (user.bot) return;

  const ready = await prepareReaction(reaction);

  if (!ready || !isColourRoleMessage(reaction)) {
    return;
  }

  const selectedColour = findColourFromReaction(reaction);

  if (!selectedColour) return;

  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);

  const selectedRole = guild.roles.cache.get(
    selectedColour.roleId
  );

  if (!selectedRole) {
    console.error(
      `Missing colour role: ${selectedColour.name} (${selectedColour.roleId})`
    );

    return;
  }

  const colourRoleIds = COLOUR_ROLES
    .map(colour => colour.roleId)
    .filter(Boolean);

  const rolesToRemove = member.roles.cache
    .filter(role => {
      return (
        colourRoleIds.includes(role.id) &&
        role.id !== selectedRole.id
      );
    })
    .map(role => role.id);

  try {
    if (rolesToRemove.length > 0) {
      await member.roles.remove(
        rolesToRemove,
        "Selected a different colour reaction role"
      );
    }

    if (!member.roles.cache.has(selectedRole.id)) {
      await member.roles.add(
        selectedRole,
        "Selected a colour reaction role"
      );
    }

    // Remove the member's previous colour reactions
    for (const existingReaction of reaction.message.reactions.cache.values()) {
      const existingEmojiId =
        existingReaction.emoji.id ||
        existingReaction.emoji.name;

      const selectedEmojiId =
        getReactionEmojiId(reaction);

      if (existingEmojiId === selectedEmojiId) {
        continue;
      }

      const isColourEmoji = COLOUR_ROLES.some(colour => {
        return (
          getConfiguredEmojiId(colour.emoji) ===
          existingEmojiId
        );
      });

      if (!isColourEmoji) continue;

      await existingReaction.users
        .remove(user.id)
        .catch(() => {});
    }
  } catch (error) {
    console.error(
      `Failed to give ${selectedColour.name}:`,
      error
    );
  }
}

async function handleColourReactionRemove(reaction, user) {
  if (user.bot) return;

  const ready = await prepareReaction(reaction);

  if (!ready || !isColourRoleMessage(reaction)) {
    return;
  }

  const selectedColour = findColourFromReaction(reaction);

  if (!selectedColour) return;

  try {
    const member =
      await reaction.message.guild.members.fetch(user.id);

    if (member.roles.cache.has(selectedColour.roleId)) {
      await member.roles.remove(
        selectedColour.roleId,
        "Removed a colour reaction"
      );
    }
  } catch (error) {
    console.error(
      `Failed to remove ${selectedColour.name}:`,
      error
    );
  }
}

module.exports = {
  handleColourReactionAdd,
  handleColourReactionRemove
};
