const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Obtenir les infos du dépôt GitHub",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/spotymtf/SPOTY-XMD';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);

        if (!response.ok) throw new Error(`Erreur API GitHub : ${response.status}`);
        const repoData = await response.json();

        const author = repoData.owner.login;
        const stars = repoData.stargazers_count;
        const forks = repoData.forks_count;
        const createdDate = new Date(repoData.created_at).toLocaleDateString();
        const lastUpdate = new Date(repoData.updated_at).toLocaleDateString();
        const repoLink = repoData.html_url;

        const botname = "ＳＰＯＴＹ－ＸＭＤ";

        const caption = `
┏━━━━━━━━━━━━━━━━━━━⬣
┃   *${botname}*
┃━━━━━━━━━━━━━━━━━━━
┃ 👤 *ᴏᴡɴᴇʀ:* ${author}
┃ 📦 *ʀᴇᴘᴏ:* ${repoLink}
┃ 🌟 *sᴛᴀʀs:* ${stars}
┃ 🍴 *ғᴏʀᴋs:* ${forks}
┃ 🗓️ *ᴄʀᴇᴀᴛᴇᴅ:* ${createdDate}
┃ 🔄 *ᴜᴘᴅᴀᴛᴇᴅ:* ${lastUpdate}
┃ 🌐 *sᴇssɪᴏɴ:* spoty-xmd-session.onrender.com 
┗━━━━━━━━━━━━━━━━━━━⬣

💬 *ʜᴇʏ*, ᴛʜɪs ɪs *${botname}*,  
the ᴍᴏsᴛ ᴀᴅᴠᴀɴᴄᴇᴅ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ  
ᴄᴏᴅᴇᴅ ʙʏ *sᴘᴏᴛʏ ᴍᴛғ* 👑

✨ ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ & ɢɪᴠᴇ ᴀ ⭐ ᴏɴ ɢɪᴛʜᴜʙ!
`;

        const thumbnail = await axios.get('https://files.catbox.moe/qjkpw0.jpg', {
            responseType: 'arraybuffer'
        }).then(res => res.data);

        await conn.sendMessage(from, {
            image: thumbnail,
            caption: caption.trim(),
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420482137109@newsletter',
                    newsletterName: '𝐒𝐏𝐎𝐓𝐘-𝐗𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Erreur:", err);
        reply("❌ Une erreur est survenue : " + err.message);
    }
});
