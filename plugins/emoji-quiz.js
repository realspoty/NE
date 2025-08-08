const { cmd } = require('../command');
const activeGames = {};

// 🏆 100+ Emoji Riddles
const emojiRiddles = [
  // Movies (30)
  { answer: "The Lion King", emojis: "🦁👑🎵" },
  { answer: "Pirates of the Caribbean", emojis: "🏴‍☠️⚔️🍺" },
  { answer: "Harry Potter", emojis: "⚡🧙‍♂️📚" },
  { answer: "Spider Man", emojis: "🕷️👦🕸️" },
  { answer: "Frozen", emojis: "❄️👸🦎" },
  { answer: "Avengers", emojis: "🦸‍♂️🦸‍♀️💥" },
  { answer: "Titanic", emojis: "🚢🧊❤️" },
  { answer: "Jurassic Park", emojis: "🦖🌴🚙" },
  { answer: "The Matrix", emojis: "👓💊🕶️" },
  { answer: "Finding Nemo", emojis: "🐠👨‍👦🌊" },
  { answer: "Toy Story", emojis: "🤠🧸🚀" },
  { answer: "The Incredibles", emojis: "👨‍👩‍👧‍👦🦸‍♂️🎭" },
  { answer: "Shrek", emojis: "👹🐴💚" },
  { answer: "Transformers", emojis: "🚗🤖⚡" },
  { answer: "Back to the Future", emojis: "⏰🚗⚡" },
  { answer: "E.T.", emojis: "👽🚲🌕" },
  { answer: "Jaws", emojis: "🦈🌊😱" },
  { answer: "The Godfather", emojis: "🍊🤵🔫" },
  { answer: "Forrest Gump", emojis: "🏃‍♂️🍫🦐" },
  { answer: "The Wizard of Oz", emojis: "👠🌪️🦁" },
  { answer: "Star Wars", emojis: "⭐⚔️👽" },
  { answer: "Indiana Jones", emojis: "🧢🏹💎" },
  { answer: "Ghostbusters", emojis: "👻🚫🎒" },
  { answer: "The Terminator", emojis: "🤖🔫🕶️" },
  { answer: "Home Alone", emojis: "👦🏠😱" },
  { answer: "The Grinch", emojis: "💚🎄👹" },
  { answer: "Despicable Me", emojis: "👨‍👧‍👦💛🍌" },
  { answer: "Coco", emojis: "🎸💀🌺" },
  { answer: "Zootopia", emojis: "🐰🦊👮‍♀️" },
  { answer: "Moana", emojis: "🌊👧🐢" },

  // Celebrities (20)
  { answer: "Elon Musk", emojis: "🚀💵🤖" },
  { answer: "Michael Jackson", emojis: "👑🎤🕴️" },
  { answer: "Beyonce", emojis: "🎤👑🐝" },
  { answer: "Dwayne Johnson", emojis: "🪨💪🏽🎬" },
  { answer: "Taylor Swift", emojis: "🎤🐍❤️" },
  { answer: "Drake", emojis: "🦉🎤6️⃣" },
  { answer: "Rihanna", emojis: "🌴💄👑" },
  { answer: "Kanye West", emojis: "🎤👽🌊" },
  { answer: "Donald Trump", emojis: "🇺🇸🦅🧴" },
  { answer: "Kim Kardashian", emojis: "📸💍👄" },
  { answer: "Cristiano Ronaldo", emojis: "⚽🇵🇹💪" },
  { answer: "Lionel Messi", emojis: "⚽🇦🇷👑" },
  { answer: "LeBron James", emojis: "🏀👑👑" },
  { answer: "Bill Gates", emojis: "💻💰🦟" },
  { answer: "Oprah Winfrey", emojis: "🎤📚💫" },
  { answer: "Tom Cruise", emojis: "🎬✈️😃" },
  { answer: "Angelina Jolie", emojis: "👩‍👧‍👦💋🔪" },
  { answer: "Brad Pitt", emojis: "🎬👨‍🦳💍" },
  { answer: "Jennifer Lopez", emojis: "💃🎤💍" },
  { answer: "Will Smith", emojis: "👨‍👩‍👧‍👦🎬👽" },

  // Brands (20)
  { answer: "McDonald's", emojis: "🍟🍔🟡" },
  { answer: "Nike", emojis: "👟✔️🏃" },
  { answer: "Starbucks", emojis: "☕🧜‍♀️🟢" },
  { answer: "Apple", emojis: "🍎📱💻" },
  { answer: "Adidas", emojis: "👟🔺🔺" },
  { answer: "Coca Cola", emojis: "🥤🔴🎄" },
  { answer: "Pepsi", emojis: "🥤🔵🔴" },
  { answer: "Amazon", emojis: "📦😊➡️" },
  { answer: "Google", emojis: "🔍🌈📱" },
  { answer: "Netflix", emojis: "📺🍿🔴" },
  { answer: "Disney", emojis: "🏰🐭🎆" },
  { answer: "Tesla", emojis: "🚗⚡🔋" },
  { answer: "Facebook", emojis: "👍🔵👥" },
  { answer: "Instagram", emojis: "📸🌈👍" },
  { answer: "Twitter", emojis: "🐦💙✍️" },
  { answer: "YouTube", emojis: "▶️🔴📹" },
  { answer: "Spotify", emojis: "🎵🟢🔊" },
  { answer: "Red Bull", emojis: "🐂🔴🪽" },
  { answer: "Mercedes", emojis: "🚗⭐🔵" },
  { answer: "BMW", emojis: "🚗🔵⚪" },

  // Animals (15)
  { answer: "Elephant", emojis: "🐘👂🌊" },
  { answer: "Giraffe", emojis: "🦒🦒🌳" },
  { answer: "Penguin", emojis: "🐧❄️🏊" },
  { answer: "Kangaroo", emojis: "🦘🇦🇺👶" },
  { answer: "Panda", emojis: "🐼🎋⚫⚪" },
  { answer: "Dolphin", emojis: "🐬🌊🎵" },
  { answer: "Octopus", emojis: "🐙8️⃣🌊" },
  { answer: "Butterfly", emojis: "🦋🌸🌈" },
  { answer: "Peacock", emojis: "🦚🌈👀" },
  { answer: "Tiger", emojis: "🐅🧡🖤" },
  { answer: "Lion", emojis: "🦁👑🌍" },
  { answer: "Zebra", emojis: "🦓⚫⚪" },
  { answer: "Koala", emojis: "🐨🌿😴" },
  { answer: "Hippo", emojis: "🦛💦😴" },
  { answer: "Sloth", emojis: "🦥🌿🐌" },

  // Food & Drinks (15)
  { answer: "Pizza", emojis: "🍕🇮🇹🧀" },
  { answer: "Burger", emojis: "🍔🧀🥬" },
  { answer: "Sushi", emojis: "🍣🇯🇵🐟" },
  { answer: "Taco", emojis: "🌮🇲🇽🌶️" },
  { answer: "Ice Cream", emojis: "🍨🍦😋" },
  { answer: "Chocolate", emojis: "🍫🍫😍" },
  { answer: "Coffee", emojis: "☕😴🔥" },
  { answer: "Beer", emojis: "🍺😋🍻" },
  { answer: "Wine", emojis: "🍷🍇😊" },
  { answer: "Popcorn", emojis: "🍿🎬😋" },
  { answer: "Donut", emojis: "🍩🍩😋" },
  { answer: "Pancake", emojis: "🥞🍯😋" },
  { answer: "Cheese", emojis: "🧀🐭😋" },
  { answer: "Watermelon", emojis: "🍉🌞😋" },
  { answer: "Egg", emojis: "🥚🐣🍳" }
];

cmd({
  pattern: "emoji",
  alias: ["emojigame", "guess"],
  desc: "Start an Emoji Quiz game",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from, sender, reply }) => {
  if (activeGames[from]) return reply("🎮 ᴀ ɢᴀᴍᴇ ɪꜱ ᴀʟʀᴇᴀᴅʏ ʀᴜɴɴɪɴɢ ʜᴇʀᴇ!");

  const riddle = emojiRiddles[Math.floor(Math.random() * emojiRiddles.length)];
  const game = {
    answer: riddle.answer.toLowerCase(),
    emojis: riddle.emojis,
    active: true,
    timeout: null,
    hintsGiven: 0,
    maxHints: 2,
  };

  const cleanup = () => {
    clearTimeout(game.timeout);
    delete activeGames[from];
  };

  game.timeout = setTimeout(() => {
    if (activeGames[from]) {
      cleanup();
      conn.sendMessage(from, { 
        text: `⏰ *ᴛɪᴍᴇ'ꜱ ᴜᴘ!* ᴛʜᴇ ᴀɴꜱᴡᴇʀ ᴡᴀꜱ *${game.answer}*.\n\n${game.emojis}` 
      });
    }
  }, 3 * 60 * 1000);

  await conn.sendMessage(from, {
    text: `🎮 *ᴇᴍᴏᴊɪ Qᴜɪᴢ ꜱᴛᴀʀᴛᴇᴅ!*\n\nɢᴜᴇꜱꜱ ᴡʜᴀᴛ ᴛʜɪꜱ ʀᴇᴘʀᴇꜱᴇɴᴛꜱ:\n\n${game.emojis}\n\nʀᴇᴘʟʏ ᴡɪᴛʜ ʏᴏᴜʀ ᴀɴꜱᴡᴇʀ (ᴇ.ɢ., "ʜᴀʀʀʏ ᴘᴏᴛᴛᴇʀ")\n\n*ᴄᴏᴍᴍᴀɴᴅꜱ:*\n- .ʜɪɴᴛ (ɢᴇᴛ ᴀ ʜɪɴᴛ)\n- .ꜱᴛᴏᴘ (ᴇɴᴅ ɢᴀᴍᴇ)`,
  }, { quoted: m });

  activeGames[from] = game;
  conn.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || !activeGames[from]) return;

    const text = (msg.message.conversation || "").trim().toLowerCase();
    const senderJid = msg.key.participant || msg.key.remoteJid;

    if (text === ".stop" && senderJid === sender) {
      cleanup();
      return conn.sendMessage(from, { 
        text: `🛑 *ɢᴀᴍᴇ ꜱᴛᴏᴘᴘᴇᴅ!* ᴛʜᴇ ᴀɴꜱᴡᴇʀ ᴡᴀꜱ *${game.answer}*.` 
      });
    }

    if (text === ".hint") {
      if (game.hintsGiven >= game.maxHints) {
        return conn.sendMessage(from, { 
          text: `❌ ɴᴏ ᴍᴏʀᴇ ʜɪɴᴛꜱ ʟᴇꜰᴛ! ᴛʀʏ ɢᴜᴇꜱꜱɪɴɢ.` 
        });
      }
      game.hintsGiven++;
      const hint = game.answer.substring(0, game.hintsGiven * 3);
      return conn.sendMessage(from, { 
        text: `💡 *ʜɪɴᴛ:* \`${hint}...\`` 
      });
    }

    if (text === game.answer) {
      cleanup();
      return conn.sendMessage(from, {
        text: `🎉 *ᴄᴏʀʀᴇᴄᴛ!* @${senderJid.split("@")[0]} ɢᴜᴇꜱꜱᴇᴅ ɪᴛ!\n\nᴀɴꜱᴡᴇʀ: *${game.answer}*\n${game.emojis}`,
        mentions: [senderJid]
      });
    }
  });
});
