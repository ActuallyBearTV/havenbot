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
  { name: "❓ Daily Question", id: "ping_daily_question" },
  { name: "📢 Announcement Ping", id: "ping_announcement" },
  { name: "🚀 Bump Reminder", id: "ping_bump_reminder" }
];
const SELF_ROLES = [
  { name: "♂️ Male", id: "gender_male", group: "gender" },
  { name: "♀️ Female", id: "gender_female", group: "gender" },
  { name: "⚧ Other", id: "gender_other", group: "gender" },

  { name: "18+", id: "age_18plus", group: "age" },
  { name: "19-21", id: "age_19_21", group: "age" },
  { name: "22-25", id: "age_22_25", group: "age" },
  { name: "26-30", id: "age_26_30", group: "age" },
  { name: "30+", id: "age_30plus", group: "age" },

  { name: "🇬🇧 United Kingdom", id: "location_uk", group: "location" },
  { name: "🇺🇸 United States", id: "location_us", group: "location" },
  { name: "🇪🇺 Europe", id: "location_eu", group: "location" },
  { name: "🌍 Other Location", id: "location_other", group: "location" },

  { name: "🎮 Gamer", id: "interest_gamer", group: "interest" },
  { name: "🎵 Music Lover", id: "interest_music", group: "interest" },
  { name: "🎬 Movie Lover", id: "interest_movie", group: "interest" },
  { name: "📺 Anime Fan", id: "interest_anime", group: "interest" },
  { name: "🐶 Pet Lover", id: "interest_pet", group: "interest" },
  { name: "💻 Tech Enthusiast", id: "interest_tech", group: "interest" },
  { name: "🎨 Creative", id: "interest_creative", group: "interest" },
  { name: "🌙 Night Owl", id: "interest_nightowl", group: "interest" }
];
module.exports = {
  COLOUR_ROLES,
  OPTIONAL_PINGS,
  SELF_ROLES
};
