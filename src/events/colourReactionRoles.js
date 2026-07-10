const { COLOUR_ROLES } = require("../config/constants");

const COLOUR_CHANNEL_NAME = "🎨・colour-roles";
const COLOUR_PANEL_TITLE = "˖ ࣪ ⊹ **colour roles** ୨୧ ˖";

function getConfiguredEmojiId(emoji) {
  if (!emoji) return null;

  const customEmoji = emoji.match(/<a?:\w+:(\d+)>/);

  return customEmoji ? customEmoji[1] : emoji;
}

function getReactionEmojiId(reaction) {
  return reaction.emoji.id || reaction.emoji.name;
}

function findColour(reaction) {
  const reactionEmojiId = getReactionEmojiId(reaction);

  return COLOUR_ROLES.find(colour => {
    return getConfiguredEmojiId(colour.emoji) === reactionEmojiId;
  });
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
    console.error("Could not fetch partial reaction:", error);
    return false;
  }
}

function isColourPanel(reaction) {
  const message = reaction.message;

  if (!message.guild) return false;
  if (message.channel.name !== COLOUR_CHANNEL_NAME) return false;
  if (message.author?.id !== message.client.user.id) return false;

  return message.content.startsWith(COLOUR_PANEL_TITLE);
}

async function removeOldColourReactions(message, userId, selectedEmojiId) {
  for (const messageReaction of message.reactions.cache.values()) {
    const emojiId =
      messageReaction.emoji.id || messageReaction.emoji.name;

    if (emojiId === selectedEmojiId) continue;

    const isColourEmoji = COLOUR_ROLES.some(colour => {
      return getConfiguredEmojiId(colour.emoji) === emojiId;
    });

    if (!isColourEmoji) continue;

    try {
      await messageReaction.users.remove(userId);
    } catch (error) {
      console.warn(
        `Could not remove old colour reaction from ${userId}:`,
        error.message
      );
    }
  }
}

async function handleColourReactionAdd(reaction, user) {
  if (user.bot) return;

  const prepared = await prepareReaction(reaction);

  if (!prepared || !isColourPanel(reaction)) return;

  const selectedColour = findColour(reaction);

  if (!selectedColour) return;

  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);
  const selectedRole = guild.roles.cache.get(
    selectedColour.roleId
  );

  if (!selectedRole) {
    console.error(
      `Colour role does not exist: ${selectedColour.roleId}`
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
        "Member selected a new colour reaction role"
      );
    }

    if (!member.roles.cache.has(selectedRole.id)) {
      await member.roles.add(
        selectedRole,
        "Member selected a colour reaction role"
      );
    }

    await removeOldColourReactions(
      reaction.message,
      user.id,
      getReactionEmojiId(reaction)
    );
  } catch (error) {
    console.error(
      `Could not add colour role ${selectedColour.name}:`,
      error
    );
  }
}

async function handleColourReactionRemove(reaction, user) {
  if (user.bot) return;

  const prepared = await prepareReaction(reaction);

  if (!prepared || !isColourPanel(reaction)) return;

  const selectedColour = findColour(reaction);

  if (!selectedColour) return;

  try {
    const member = await reaction.message.guild.members.fetch(
      user.id
    );

    if (member.roles.cache.has(selectedColour.roleId)) {
      await member.roles.remove(
        selectedColour.roleId,
        "Member removed a colour reaction"
      );
    }
  } catch (error) {
    console.error(
      `Could not remove colour role ${selectedColour.name}:`,
      error
    );
  }
}

module.exports = {
  handleColourReactionAdd,
  handleColourReactionRemove
};
