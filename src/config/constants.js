const COLOUR_ROLES = [
  { name: "❤️ Crimson", hex: "#E53935", id: "colour_crimson" },
  { name: "🩷 Pink", hex: "#EC4899", id: "colour_pink" },
  { name: "💜 Purple", hex: "#8B5CF6", id: "colour_purple" },
  { name: "💙 Blue", hex: "#3B82F6", id: "colour_blue" },
  { name: "🩵 Cyan", hex: "#06B6D4", id: "colour_cyan" },
  { name: "💚 Green", hex: "#22C55E", id: "colour_green" },
  { name: "💛 Yellow", hex: "#FACC15", id: "colour_yellow" },
  { name: "🧡 Orange", hex: "#F97316", id: "colour_orange" },
  { name: "🤎 Brown", hex: "#8B5A2B", id: "colour_brown" },
  { name: "🤍 White", hex: "#FFFFFF", id: "colour_white" },
  { name: "🩶 Grey", hex: "#6B7280", id: "colour_grey" },
  { name: "🖤 Black", hex: "#1F2937", id: "colour_black" }
];

const OPTIONAL_PINGS = [
  { name: "💗 Chat Revive", id: "ping_chat_revive" },
  { name: "🎙️ VC Revive", id: "ping_vc_revive" },
  { name: "❓ Daily Question", id: "ping_daily_question" }
];
const SELF_ROLES = [
  { name: "♂️ Male", id: "gender_male", group: "gender" },
  { name: "♀️ Female", id: "gender_female", group: "gender" },
  { name: "⚧️ Non-Binary", id: "gender_non_binary", group: "gender" },

  { name: "🔞 18-20", id: "age_18_20", group: "age" },
  { name: "🪪 21-24", id: "age_21_24", group: "age" },
  { name: "🎂 25-29", id: "age_25_29", group: "age" },
  { name: "🍷 30+", id: "age_30_plus", group: "age" },

  { name: "🇬🇧 UK", id: "location_uk", group: "location" },
  { name: "🇪🇺 Europe", id: "location_europe", group: "location" },
  { name: "🇺🇸 North America", id: "location_north_america", group: "location" },
  { name: "🌏 Asia", id: "location_asia", group: "location" },
  { name: "🌊 Oceania", id: "location_oceania", group: "location" },
  { name: "🌍 Other", id: "location_other", group: "location" },

  { name: "🎮 Gaming", id: "interest_gaming", group: "interest" },
  { name: "🎵 Music", id: "interest_music", group: "interest" },
  { name: "🎬 Movies", id: "interest_movies", group: "interest" },
  { name: "🍿 Anime", id: "interest_anime", group: "interest" },
  { name: "⛏️ Minecraft", id: "interest_minecraft", group: "interest" },
  { name: "🎨 Art", id: "interest_art", group: "interest" }
];
module.exports = {
  COLOUR_ROLES,
  OPTIONAL_PINGS,
  SELF_ROLES
};
