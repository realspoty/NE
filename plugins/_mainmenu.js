const os = require("os");
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

const readMore = String.fromCharCode(8206).repeat(4001);
const imageUrl = config.MENU_IMAGE_URL  ||  'https://files.catbox.moe/qjkpw0.jpg';

cmd({
    pattern: "menu",
    alias: ["help", "alive"],
    desc: "Show all menu categories",
    category: "main",
    react: "⏬",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const version = "1.0.1";
        const totalCommands = commands.length;

        let menuText = `
\`\`\`ＳＰＯＴＹ－ＸＭＤ\`\`\`

⟣──────────────────⟢
▧ *ᴄʀᴇᴀᴛᴏʀ* : *sᴘᴏᴛʏ ᴍᴛғ*
▧ *ᴍᴏᴅᴇ* : *${config.MODE}* 
▧ *ᴘʀᴇғɪx* : *${config.PREFIX}*
▧ *ʀᴀᴍ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB 
▧ *ᴠᴇʀsɪᴏɴ* : *${version}* 
▧ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())}
▧ *ᴄᴏᴍᴍᴀɴᴅs* : ${totalCommands}
⟣──────────────────⟢
${readMore}
`;

        const categories = [...new Set(commands.map(cmd => cmd.category))];

        for (const category of categories) {
            const cmdsInCat = commands.filter(cmd => cmd.category === category);
            if (cmdsInCat.length === 0) continue;

            menuText += `\n*🎴 \`${category.toUpperCase()} MENU\` 🎴*\n\n`;
            menuText += '╭─────────────···◈\n';
            cmdsInCat.forEach(cmd => {
                menuText += `*┋* *⬡ ${config.PREFIX}${cmd.pattern}*\n`;
            });
            menuText += '╰─────────────╶╶···◈*\n';
        }

        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: menuText.trim(),
                ai: true,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420482137109@newsletter',
                        newsletterName: '『 SPOTY-XMD 』 ',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error(e);
        reply("❌ Error while generating menu:\n" + e.toString());
    }
});
