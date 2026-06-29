require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { toggleColourRole } = require("./src/buttons/colourRoles");
const { havenEmbed } = require("./src/utils/embed");
const {
  findChannel,
  findRole
} = require("./src/utils/finders");
const {
  COLOUR_ROLES,
  OPTIONAL_PINGS
} = require("./src/config/constants");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

async function createColourRoles(guild) {
  for (const colour of COLOUR_ROLES) {
    const existingRole = findRole(guild, colour.name);

    if (!existingRole) {
      await guild.roles.create({
        name: colour.name,
        color: colour.hex,
        hoist: false,
        mentionable: false,
        reason: "Haven colour role setup"
      });
    }
  }
}

async function createOptionalPingRoles(guild) {
  for (const ping of OPTIONAL_PINGS) {
    const existingRole = findRole(guild, ping.name);

    if (!existingRole) {
      await guild.roles.create({
        name: ping.name,
        color: "#F9A8D4",
        hoist: false,
        mentionable: true,
        reason: "Haven optional ping role setup"
      });
    }
  }
}

async function postColourRoleMenu(guild) {
  const channel = findChannel(guild, "🎨・colour-roles");

  if (!channel) {
    throw new Error("Could not find 🎨・colour-roles channel.");
  }

  const rows = [];
  let currentRow = new ActionRowBuilder();

  COLOUR_ROLES.forEach((colour, index) => {
    if (index > 0 && index % 4 === 0) {
      rows.push(currentRow);
      currentRow = new ActionRowBuilder();
    }

    currentRow.addComponents(
      new ButtonBuilder()
        .setCustomId(colour.id)
        .setLabel(colour.name)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  rows.push(currentRow);

  await channel.send({
    embeds: [
      havenEmbed(
        "🎨 Choose Your Colour",
        [
          "Personalise your name with your favourite colour!",
          "",
          "Click a button below to choose your colour role.",
          "",
          "You can only have **one colour role** at a time.",
          "Choosing a new colour will remove your old one."
        ].join("\n"),
        "#8B5CF6"
      )
    ],
    components: rows
  });
}

async function postOptionalPingMenu(guild) {
  const channel = findChannel(guild, "🔔・notification-roles");

  if (!channel) {
    throw new Error("Could not find 🔔・notification-roles channel.");
  }

  const row = new ActionRowBuilder();

  OPTIONAL_PINGS.forEach(ping => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(ping.id)
        .setLabel(ping.name)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  await channel.send({
    embeds: [
      havenEmbed(
        "Optional Pings ♡₊˚",
        [
          "Choose which notifications you'd like to receive!",
          "",
          "💗 **Chat Revive**",
          "Be notified when we're trying to get chat active again.",
          "",
          "🎙️ **VC Revive**",
          "Get pinged whenever people are looking to start a voice chat.",
          "",
          "❓ **Daily Question**",
          "Receive a daily conversation starter to join in with the community.",
          "",
          "You can enable or disable these at any time by clicking the buttons below."
        ].join("\n"),
        "#F9A8D4"
      )
    ],
    components: [row]
  });
}

async function toggleOptionalPing(interaction) {
  const selectedPing = OPTIONAL_PINGS.find(ping => ping.id === interaction.customId);

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

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("colour_")) {
        return toggleColourRole(interaction);
      }

      if (interaction.customId.startsWith("ping_")) {
        return toggleOptionalPing(interaction);
      }
    }

    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "setup-colour-roles") {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            content: "You need Administrator permission to use this command.",
            ephemeral: true
          });
        }

        await interaction.reply({
          content: "Setting up colour roles...",
          ephemeral: true
        });

        await createColourRoles(interaction.guild);
        await postColourRoleMenu(interaction.guild);

        return interaction.followUp({
          content: "Colour roles are ready.",
          ephemeral: true
        });
      }

      if (interaction.commandName === "setup-optional-pings") {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            content: "You need Administrator permission to use this command.",
            ephemeral: true
          });
        }

        await interaction.reply({
          content: "Setting up optional pings...",
          ephemeral: true
        });

        await createOptionalPingRoles(interaction.guild);
        await postOptionalPingMenu(interaction.guild);

        return interaction.followUp({
          content: "Optional ping roles are ready.",
          ephemeral: true
        });
      }

      if (interaction.commandName === "post-custom") {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
          return interaction.reply({
            content: "You need Manage Messages permission to use this command.",
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("haven_custom_announcement_modal")
          .setTitle("Haven Announcement");

        const titleInput = new TextInputBuilder()
          .setCustomId("announcement_title")
          .setLabel("Announcement Title")
          .setPlaceholder("Example: Colour Roles Are Live!")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100);

        const messageInput = new TextInputBuilder()
          .setCustomId("announcement_message")
          .setLabel("Announcement Message")
          .setPlaceholder("Type what you want the bot to say...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(titleInput),
          new ActionRowBuilder().addComponents(messageInput)
        );

        return interaction.showModal(modal);
      }

      if (interaction.commandName === "verify") {
        return interaction.reply({
          content: "✅ Haven Bot is online and working!",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: "This command is installed, but this feature has not been connected yet.",
        ephemeral: true
      });
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId !== "haven_custom_announcement_modal") return;

      const title = interaction.fields.getTextInputValue("announcement_title");
      const message = interaction.fields.getTextInputValue("announcement_message");

      await interaction.channel.send({
        embeds: [havenEmbed(`📢 ${title}`, message)]
      });

      return interaction.reply({
        content: "Announcement posted.",
        ephemeral: true
      });
    }
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({
        content: "Something went wrong. Check the bot logs.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content: "Something went wrong. Check the bot logs.",
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
