require("dotenv").config();

const {
  Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const STAFF_ROLES = ["🎫 Trial Moderator","🛠️ Moderator","⚔️ Senior Moderator","🛡️ Administrator","👑 Management","💎 Co-Owner","❤️ Owner"];

const ROLES = [
["❤️ Owner","#ff3b5c",true],["💎 Co-Owner","#ff7eb9",true],["👑 Management","#b45cff",true],
["🛡️ Administrator","#4d8dff",true],["⚔️ Senior Moderator","#42d392",true],["🛠️ Moderator","#6ee7b7",true],
["🎫 Trial Moderator","#facc15",true],["🤖 Bots","#99a1af",true],["🌸 OG","#ff9acb",false],
["✨ Server Booster","#f47fff",false],["⭐ VIP","#ffd166",false],["💖 Trusted","#ff6bcb",false],
["🎮 Gamer","#5865f2",false],["🎵 Music Lover","#c084fc",false],["🎬 Movie Lover","#fb7185",false],
["📺 Anime Fan","#f472b6",false],["🐶 Pet Lover","#f59e0b",false],["💻 Tech Enthusiast","#38bdf8",false],
["🎨 Creative","#2dd4bf",false],["🌙 Night Owl","#818cf8",false],["🇬🇧 United Kingdom","#60a5fa",false],
["🇺🇸 United States","#ef4444",false],["🇪🇺 Europe","#2563eb",false],["🌍 Other Location","#22c55e",false],
["18+","#94a3b8",false],["19-21","#94a3b8",false],["22-25","#94a3b8",false],["26-30","#94a3b8",false],
["30+","#94a3b8",false],["♂️ Male","#38bdf8",false],["♀️ Female","#fb7185",false],["⚧️ Other","#c084fc",false],
["✅ Verified","#22c55e",false],["❤️ Member","#ff6bcb",false],["🔇 Muted","#64748b",false]
];

const COLOURS = [
{ name:"❤️ Crimson", hex:"#E53935", id:"colour_crimson" },{ name:"🩷 Pink", hex:"#EC4899", id:"colour_pink" },
{ name:"💜 Purple", hex:"#8B5CF6", id:"colour_purple" },{ name:"💙 Blue", hex:"#3B82F6", id:"colour_blue" },
{ name:"🩵 Cyan", hex:"#06B6D4", id:"colour_cyan" },{ name:"💚 Green", hex:"#22C55E", id:"colour_green" },
{ name:"💛 Yellow", hex:"#FACC15", id:"colour_yellow" },{ name:"🧡 Orange", hex:"#F97316", id:"colour_orange" },
{ name:"🤎 Brown", hex:"#8B5A2B", id:"colour_brown" },{ name:"🤍 White", hex:"#FFFFFF", id:"colour_white" },
{ name:"🩶 Grey", hex:"#6B7280", id:"colour_grey" },{ name:"🖤 Black", hex:"#1F2937", id:"colour_black" }
];

const PINGS = [
{ name:"💗 Chat Revive", id:"ping_chat_revive" },
{ name:"🎙️ VC Revive", id:"ping_vc_revive" },
{ name:"❓ Daily Question", id:"ping_daily_question" }
];

const CATEGORIES = [
["╭─── ✦ WELCOME ✦ ───╮","public",[["📢・announcements","locked"],["📜・rules","locked"],["✨・server-guide","locked"],["🎉・events","locked"],["📈・updates","locked"],["❤️・about-haven","locked"]]],
["╭─── ✦ START HERE ✦ ───╮","public",[["✅・verify","public"],["🎂・age-roles","public"],["🚻・gender-roles","public"],["🌍・location-roles","public"],["🎮・interest-roles","public"],["🎨・colour-roles","public"],["🔔・notification-roles","public"],["🙋・introductions","verified"]]],
["╭─── ✦ COMMUNITY ✦ ───╮","verified",[["💬・general","verified"],["🌙・late-night-chat","verified"],["🤝・make-friends","verified"],["❓・question-of-the-day","verified"],["😂・memes","verified"],["📸・selfies","verified"],["🐶・pets","verified"],["🍕・food","verified"],["🎵・music","verified"],["🎬・movies-tv","verified"],["📺・anime","verified"],["📚・books","verified"],["🎂・birthdays","verified"]]],
["╭─── ✦ GAMING ✦ ───╮","verified",[["🎮・gaming-chat","verified"],["🕹️・looking-for-group","verified"],["⛏️・minecraft","verified"],["🔫・fps-games","verified"],["🚗・racing-games","verified"],["🎲・party-games","verified"],["📱・mobile-games","verified"],["🎥・stream-clips","verified"]]],
["╭─── ✦ EVENTS ✦ ───╮","verified",[["🎉・giveaways","locked"],["🏆・competitions","verified"],["🎲・game-nights","verified"],["🎬・movie-nights","verified"],["🎵・music-events","verified"],["📅・event-schedule","locked"]]],
["╭─── ✦ SUPPORT ✦ ───╮","verified",[["🎫・create-ticket","locked"],["❓・help","verified"],["💡・suggestions","verified"],["🐛・bug-reports","verified"]]],
["╭─── ✦ STAFF ✦ ───╮","staff",[["📋・staff-chat","staff"],["📊・staff-logs","staff"],["🚨・reports","staff"],["⚙️・bot-logs","staff"]]],
["╭─── ✦ VOICE ✦ ───╮","verified",[["🔊 General VC","voice"],["🎮 Gaming VC","voice"],["💕 Chill VC","voice"],["🌙 Late Night VC","voice"],["🎵 Music VC","voice"],["🎬 Movie Night","voice"]]]
];

const role = (guild, name) => guild.roles.cache.find(r => r.name === name);
const channel = (guild, name) => guild.channels.cache.find(c => c.name === name || c.name === name.toLowerCase());

function embed(title, desc, color="#8B5CF6"){
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(desc).setFooter({text:"Haven • A community to belong"}).setTimestamp();
}

async function createRole(guild, name, color, hoist=false, mentionable=false){
  let r = role(guild, name);
  if (r) return r;
  return guild.roles.create({ name, color, hoist, mentionable, reason:"Haven bot setup" });
}

function perms(guild, type){
  const everyone = guild.roles.everyone;
  const verified = role(guild, "✅ Verified");
  const muted = role(guild, "🔇 Muted");
  const staff = STAFF_ROLES.map(n=>role(guild,n)).filter(Boolean);
  const rows = [];

  if(type === "public") rows.push({id:everyone.id, allow:[PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]});
  if(type === "verified" || type === "voice"){
    rows.push({id:everyone.id, deny:[PermissionFlagsBits.ViewChannel]});
    if(verified) rows.push({id:verified.id, allow:[PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]});
  }
  if(type === "locked"){
    rows.push({id:everyone.id, allow:[PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory], deny:[PermissionFlagsBits.SendMessages]});
    for(const s of staff) rows.push({id:s.id, allow:[PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]});
  }
  if(type === "staff"){
    rows.push({id:everyone.id, deny:[PermissionFlagsBits.ViewChannel]});
    for(const s of staff) rows.push({id:s.id, allow:[PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]});
  }
  if(muted) rows.push({id:muted.id, deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions]});
  return rows;
}

async function install(guild){
  for(const [n,c,h] of ROLES) await createRole(guild,n,c,h);
  for(const [catName, catType, chs] of CATEGORIES){
    let cat = guild.channels.cache.find(c=>c.name===catName && c.type===ChannelType.GuildCategory);
    if(!cat) cat = await guild.channels.create({name:catName,type:ChannelType.GuildCategory,permissionOverwrites:perms(guild,catType)});
    for(const [chName,chType] of chs){
      if(channel(guild,chName)) continue;
      await guild.channels.create({name:chName,type:chType==="voice"?ChannelType.GuildVoice:ChannelType.GuildText,parent:cat.id,permissionOverwrites:perms(guild,chType)});
    }
  }
  await starterEmbeds(guild);
}

async function starterEmbeds(guild){
  const rules = channel(guild,"📜・rules");
  const guide = channel(guild,"✨・server-guide");
  const verify = channel(guild,"✅・verify");
  const tickets = channel(guild,"🎫・create-ticket");
  if(rules) await rules.send({embeds:[embed("📜 Haven Rules","1. Be respectful.\\n2. No harassment or hate speech.\\n3. No spam.\\n4. No NSFW in public channels.\\n5. No advertising outside allowed channels.\\n6. Do not share private information.\\n7. Use channels properly.\\n8. Follow Discord ToS.\\n9. Listen to staff.\\n10. Keep Haven friendly and fun.")]});
  if(guide) await guide.send({embeds:[embed("✨ Welcome to Haven","Haven is a friendly social community for chatting, gaming, music, movie nights, events and meeting new people.\\n\\nVerify first, pick your roles, then say hello.")]});
  if(verify){
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("verify_member").setLabel("Verify").setEmoji("✅").setStyle(ButtonStyle.Success));
    await verify.send({embeds:[embed("✅ Verify","Click below to verify and unlock Haven.","#22C55E")],components:[row]});
  }
  if(tickets){
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("open_ticket").setLabel("Open Ticket").setEmoji("🎫").setStyle(ButtonStyle.Primary));
    await tickets.send({embeds:[embed("🎫 Support Tickets","Need help? Click below to open a private ticket with staff.","#60A5FA")],components:[row]});
  }
}

async function setupColours(guild){
  for(const c of COLOURS) await createRole(guild,c.name,c.hex,false,false);
  const ch = channel(guild,"🎨・colour-roles");
  if(!ch) throw new Error("Missing colour roles channel");
  const rows=[]; let row=new ActionRowBuilder();
  COLOURS.forEach((c,i)=>{ if(i>0 && i%4===0){rows.push(row); row=new ActionRowBuilder();} row.addComponents(new ButtonBuilder().setCustomId(c.id).setLabel(c.name).setStyle(ButtonStyle.Secondary));});
  rows.push(row);
  await ch.send({embeds:[embed("🎨 Choose Your Colour","Click a button below to choose your username colour.\\n\\nYou can only have one colour at a time.","#8B5CF6")],components:rows});
}

async function setupPings(guild){
  for(const p of PINGS) await createRole(guild,p.name,"#F9A8D4",false,true);
  const ch = channel(guild,"🔔・notification-roles");
  if(!ch) throw new Error("Missing notification roles channel");
  const row = new ActionRowBuilder();
  for(const p of PINGS) row.addComponents(new ButtonBuilder().setCustomId(p.id).setLabel(p.name).setStyle(ButtonStyle.Secondary));
  await ch.send({embeds:[embed("Optional Pings ♡₊˚","Choose which notifications you'd like to receive!\\n\\n**Chat Revive** — when chat needs reviving.\\n**VC Revive** — when people are joining voice chat.\\n**Daily Question** — daily conversation starters.","#F9A8D4")],components:[row]});
}

async function openTicket(interaction){
  const guild=interaction.guild, member=interaction.member;
  const existing = guild.channels.cache.find(c=>c.name===`ticket-${member.user.username.toLowerCase()}`);
  if(existing) return interaction.reply({content:`You already have a ticket: ${existing}`,ephemeral:true});
  const overwrites=[{id:guild.roles.everyone.id,deny:[PermissionFlagsBits.ViewChannel]},{id:member.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory]}];
  for(const s of STAFF_ROLES.map(n=>role(guild,n)).filter(Boolean)) overwrites.push({id:s.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory]});
  const t = await guild.channels.create({name:`ticket-${member.user.username}`,type:ChannelType.GuildText,permissionOverwrites:overwrites});
  await t.send({content:`${member}`,embeds:[embed("🎫 Ticket Opened","Please explain what you need help with. Staff will reply soon.","#60A5FA")]});
  return interaction.reply({content:`Ticket created: ${t}`,ephemeral:true});
}

async function toggleColour(interaction){
  const picked=COLOURS.find(c=>c.id===interaction.customId);
  const r=role(interaction.guild,picked.name);
  if(!r) return interaction.reply({content:"That colour role does not exist yet.",ephemeral:true});
  const ids=COLOURS.map(c=>role(interaction.guild,c.name)).filter(Boolean).map(r=>r.id);
  const remove=interaction.member.roles.cache.filter(x=>ids.includes(x.id)&&x.id!==r.id).map(x=>x.id);
  if(remove.length) await interaction.member.roles.remove(remove);
  if(interaction.member.roles.cache.has(r.id)){ await interaction.member.roles.remove(r); return interaction.reply({content:`Removed ${picked.name}.`,ephemeral:true}); }
  await interaction.member.roles.add(r);
  return interaction.reply({content:`Your colour is now ${picked.name}.`,ephemeral:true});
}

async function togglePing(interaction){
  const picked=PINGS.find(p=>p.id===interaction.customId);
  const r=role(interaction.guild,picked.name);
  if(!r) return interaction.reply({content:"That ping role does not exist yet.",ephemeral:true});
  if(interaction.member.roles.cache.has(r.id)){ await interaction.member.roles.remove(r); return interaction.reply({content:`Removed ${picked.name}.`,ephemeral:true}); }
  await interaction.member.roles.add(r);
  return interaction.reply({content:`Added ${picked.name}.`,ephemeral:true});
}

client.once("ready",()=>console.log(`Logged in as ${client.user.tag}`));

client.on("interactionCreate", async interaction=>{
  try{
    if(interaction.isButton()){
      if(interaction.customId==="verify_member"){
        const v=role(interaction.guild,"✅ Verified"), m=role(interaction.guild,"❤️ Member");
        if(v) await interaction.member.roles.add(v); if(m) await interaction.member.roles.add(m);
        return interaction.reply({content:"You are now verified. Welcome to Haven ❤️",ephemeral:true});
      }
      if(interaction.customId==="open_ticket") return openTicket(interaction);
      if(interaction.customId.startsWith("colour_")) return toggleColour(interaction);
      if(interaction.customId.startsWith("ping_")) return togglePing(interaction);
    }

    if(interaction.isModalSubmit() && interaction.customId==="haven_custom_announcement_modal"){
      const title=interaction.fields.getTextInputValue("announcement_title");
      const message=interaction.fields.getTextInputValue("announcement_message");
      await interaction.channel.send({embeds:[embed(`📢 ${title}`,message,"#60A5FA")]});
      return interaction.reply({content:"Announcement posted.",ephemeral:true});
    }

    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName==="install-haven"){ await interaction.reply({content:"Installing Haven...",ephemeral:true}); await install(interaction.guild); return interaction.followUp({content:"Haven installed.",ephemeral:true}); }
    if(interaction.commandName==="setup-colour-roles"){ await interaction.reply({content:"Setting up colour roles...",ephemeral:true}); await setupColours(interaction.guild); return interaction.followUp({content:"Colour roles ready.",ephemeral:true}); }
    if(interaction.commandName==="setup-optional-pings"){ await interaction.reply({content:"Setting up optional pings...",ephemeral:true}); await setupPings(interaction.guild); return interaction.followUp({content:"Optional pings ready.",ephemeral:true}); }
    if(interaction.commandName==="verify"){
      const v=role(interaction.guild,"✅ Verified"), m=role(interaction.guild,"❤️ Member");
      if(v) await interaction.member.roles.add(v); if(m) await interaction.member.roles.add(m);
      return interaction.reply({content:"You are now verified. Welcome to Haven ❤️",ephemeral:true});
    }
    if(interaction.commandName==="ticket") return openTicket(interaction);
    if(interaction.commandName==="close-ticket"){ if(!interaction.channel.name.startsWith("ticket-")) return interaction.reply({content:"Use this in a ticket channel.",ephemeral:true}); await interaction.reply("Closing in 5 seconds..."); return setTimeout(()=>interaction.channel.delete("Ticket closed"),5000); }
    if(interaction.commandName==="post-custom"){
      const modal=new ModalBuilder().setCustomId("haven_custom_announcement_modal").setTitle("Haven Announcement");
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("announcement_title").setLabel("Announcement Title").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("announcement_message").setLabel("Announcement Message").setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(4000))
      );
      return interaction.showModal(modal);
    }
    if(interaction.commandName==="post-update"){ await interaction.channel.send({embeds:[embed("🌙 Haven Update • New Features","Hello everyone! ❤️\\n\\nWe're excited to share the latest improvements to **Haven**.\\n\\n🎨 Colour roles are available.\\n🎮 Personalised roles help customise your experience.\\n🚀 Coming soon: movie nights, game nights, giveaways and more.\\n\\n❤️ Welcome home. Welcome to Haven.")]}); return interaction.reply({content:"Update posted.",ephemeral:true}); }
    if(interaction.commandName==="revive-chat"){ const r=role(interaction.guild,"💗 Chat Revive"); await interaction.channel.send({content:r?`<@&${r.id}>`:"",embeds:[embed("💗 Chat Revive","Chat has gone quiet... come say hello and help bring Haven back to life ♡","#F9A8D4")],allowedMentions:{roles:r?[r.id]:[]}}); return interaction.reply({content:"Chat revive posted.",ephemeral:true}); }
    if(interaction.commandName==="revive-vc"){ const r=role(interaction.guild,"🎙️ VC Revive"); await interaction.channel.send({content:r?`<@&${r.id}>`:"",embeds:[embed("🎙️ VC Revive","Anyone up for voice chat? Join VC and come chill with everyone ♡","#F9A8D4")],allowedMentions:{roles:r?[r.id]:[]}}); return interaction.reply({content:"VC revive posted.",ephemeral:true}); }
    if(interaction.commandName==="daily-question"){ const q=interaction.options.getString("question"); const r=role(interaction.guild,"❓ Daily Question"); await interaction.channel.send({content:r?`<@&${r.id}>`:"",embeds:[embed("❓ Daily Question",`**${q}**\\n\\nDrop your answers below and get the conversation started ♡`,"#F9A8D4")],allowedMentions:{roles:r?[r.id]:[]}}); return interaction.reply({content:"Daily question posted.",ephemeral:true}); }
    if(interaction.commandName==="giveaway"){ const prize=interaction.options.getString("prize"), duration=interaction.options.getString("duration"); const msg=await interaction.channel.send({embeds:[embed("🎁 Giveaway",`Prize: **${prize}**\\nDuration: **${duration}**\\n\\nReact with 🎉 to enter!`,"#F472B6")]}); await msg.react("🎉"); return interaction.reply({content:"Giveaway created.",ephemeral:true}); }
    if(interaction.commandName==="timeout-user"){ const user=interaction.options.getUser("user"), minutes=interaction.options.getInteger("minutes"), reason=interaction.options.getString("reason")||"No reason provided"; const member=await interaction.guild.members.fetch(user.id); await member.timeout(minutes*60*1000,reason); return interaction.reply({content:`${user} timed out for ${minutes} minutes.`,ephemeral:true}); }
  }catch(e){
    console.error(e);
    const msg="Something went wrong. Check the bot console and make sure the bot role is high enough.";
    if(interaction.replied || interaction.deferred) return interaction.followUp({content:msg,ephemeral:true}).catch(()=>{});
    return interaction.reply({content:msg,ephemeral:true}).catch(()=>{});
  }
});

client.login(process.env.DISCORD_TOKEN);
