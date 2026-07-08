const Roles = require("./roles");

const COLOUR_ROLES = [
  { name: "❤️ Crimson", hex: "#E53935", id: "colour_crimson", roleId: Roles.COLOURS.CRIMSON },
  { name: "🩷 Pink", hex: "#EC4899", id: "colour_pink", roleId: Roles.COLOURS.PINK },
  { name: "💜 Purple", hex: "#8B5CF6", id: "colour_purple", roleId: Roles.COLOURS.PURPLE },
  { name: "💙 Blue", hex: "#3B82F6", id: "colour_blue", roleId: Roles.COLOURS.BLUE },
  { name: "🩵 Cyan", hex: "#06B6D4", id: "colour_cyan", roleId: Roles.COLOURS.CYAN },
  { name: "💚 Green", hex: "#22C55E", id: "colour_green", roleId: Roles.COLOURS.GREEN },
  { name: "💛 Yellow", hex: "#FACC15", id: "colour_yellow", roleId: Roles.COLOURS.YELLOW },
  { name: "🧡 Orange", hex: "#F97316", id: "colour_orange", roleId: Roles.COLOURS.ORANGE },
  { name: "🤎 Brown", hex: "#8B5A2B", id: "colour_brown", roleId: Roles.COLOURS.BROWN },
  { name: "🤍 White", hex: "#FFFFFF", id: "colour_white", roleId: Roles.COLOURS.WHITE },
  { name: "🩶 Grey", hex: "#6B7280", id: "colour_grey", roleId: Roles.COLOURS.GREY },
  { name: "🖤 Black", hex: "#1F2937", id: "colour_black", roleId: Roles.COLOURS.BLACK }
];

const OPTIONAL_PINGS = [
  { name: "💗 Chat Revive", id: "ping_chat_revive", roleId: Roles.PINGS.CHAT_REVIVE },
  { name: "🎙️ VC Revive", id: "ping_vc_revive", roleId: Roles.PINGS.VC_REVIVE },
  { name: "❓ Daily Question", id: "ping_daily_question", roleId: Roles.PINGS.DAILY_QUESTION },
  { name: "📢 Announcement Ping", id: "ping_announcement", roleId: Roles.PINGS.ANNOUNCEMENT },
  { name: "🚀 Bump Reminder", id: "ping_bump_reminder", roleId: Roles.PINGS.BUMP_REMINDER },
  { name: "🎉 Giveaways", id: "ping_giveaway", roleId: Roles.PINGS.GIVEAWAY }
];

const SELF_ROLES = [
  { name: "♂️ Male", id: "gender_male", roleId: Roles.GENDER.MALE, group: "gender" },
  { name: "♀️ Female", id: "gender_female", roleId: Roles.GENDER.FEMALE, group: "gender" },
  { name: "⚧ Non-binary", id: "gender_non_binary", roleId: Roles.GENDER.NON_BINARY, group: "gender" },
  { name: "🌊 Gender Fluid", id: "gender_fluid", roleId: Roles.GENDER.GENDER_FLUID, group: "gender" },
  { name: "🏳️‍⚧️ Transgender", id: "gender_transgender", roleId: Roles.GENDER.TRANSGENDER, group: "gender" },
  { name: "⚧ Other", id: "gender_other", roleId: Roles.GENDER.OTHER, group: "gender" },

  { name: "18+", id: "age_18plus", roleId: Roles.AGE.AGE_18PLUS, group: "age" },
  { name: "19-21", id: "age_19_21", roleId: Roles.AGE.AGE_19_21, group: "age" },
  { name: "22-25", id: "age_22_25", roleId: Roles.AGE.AGE_22_25, group: "age" },
  { name: "26-30", id: "age_26_30", roleId: Roles.AGE.AGE_26_30, group: "age" },
  { name: "30+", id: "age_30plus", roleId: Roles.AGE.AGE_30PLUS, group: "age" },

  { name: "🇬🇧 United Kingdom", id: "location_uk", roleId: Roles.LOCATION.UK, group: "location" },
  { name: "🌎 North America", id: "location_north_america", roleId: Roles.LOCATION.NORTH_AMERICA, group: "location" },
  { name: "🌎 South America", id: "location_south_america", roleId: Roles.LOCATION.SOUTH_AMERICA, group: "location" },
  { name: "🇪🇺 Europe", id: "location_eu", roleId: Roles.LOCATION.EUROPE, group: "location" },
  { name: "🌏 Asia", id: "location_asia", roleId: Roles.LOCATION.ASIA, group: "location" },
  { name: "🌍 Africa", id: "location_africa", roleId: Roles.LOCATION.AFRICA, group: "location" },
  { name: "🌊 Oceania", id: "location_oceania", roleId: Roles.LOCATION.OCEANIA, group: "location" },

  { name: "🎮 Gamer", id: "interest_gamer", roleId: Roles.INTERESTS.GAMER, group: "interest" },
  { name: "🎵 Music Lover", id: "interest_music", roleId: Roles.INTERESTS.MUSIC, group: "interest" },
  { name: "🎬 Movie Lover", id: "interest_movie", roleId: Roles.INTERESTS.MOVIE, group: "interest" },
  { name: "📺 Anime Fan", id: "interest_anime", roleId: Roles.INTERESTS.ANIME, group: "interest" },
  { name: "🐶 Pet Lover", id: "interest_pet", roleId: Roles.INTERESTS.PET, group: "interest" },
  { name: "💻 Tech Enthusiast", id: "interest_tech", roleId: Roles.INTERESTS.TECH, group: "interest" },
  { name: "🎨 Creative", id: "interest_creative", roleId: Roles.INTERESTS.CREATIVE, group: "interest" },
  { name: "🌙 Night Owl", id: "interest_nightowl", roleId: Roles.INTERESTS.NIGHT_OWL, group: "interest" }
];

module.exports = {
  COLOUR_ROLES,
  OPTIONAL_PINGS,
  SELF_ROLES
};
