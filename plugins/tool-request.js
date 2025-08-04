const { cmd } = require("../command");
const config = require("../config");
const fs = require("fs");
const path = require("path");


cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    react: ["👨‍💻"],
    filename: __filename
}, async (conn, m, msg, { args, reply }) => {
    try {
        if (!args.length) {
            return reply(`❌ Example: ${config.PREFIX}report Play command not working`);
        }

        const devNumbers = ["50934960331", "50936908256"];
        const messageId = m.key?.id;
        const sender = m.sender;
        const time = new Date().toLocaleString("en-US", { timeZone: "UTC" });

        // Empêche le double envoi
        global.reportedMessages = global.reportedMessages || {};
        if (global.reportedMessages[messageId]) {
            return reply("❌ ᴛʜɪs ʀᴇᴘᴏʀᴛ ʜᴀs ᴀʟʀᴇᴀᴅʏ ʙᴇᴇɴ ғᴏʀᴡᴀʀᴅᴇᴅ.");
        }
        global.reportedMessages[messageId] = true;

        const reportText = `*| 𝐑𝐄𝐐𝐔𝐄𝐒𝐓 / 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐈𝐍𝐈 |*\n\n*User*: @${sender.split("@")[0]}\n*ᴛɪᴍᴇ:* ${time}\n*ᴍᴇssᴀɢᴇ:* ${args.join(" ")}`;
        const confirmation = `✅ 𝐓𝐡𝐚𝐧𝐤𝐬 ${msg.pushName || "user"}, ʏᴏᴜʀ ʀᴇᴘᴏʀᴛ ʜᴀs ʙᴇᴇɴ sᴇɴᴛ ᴛᴏ ᴛʜᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀs.`;

        // Sauvegarde dans le fichier
        const reports = fs.existsSync(reportFile) ? JSON.parse(fs.readFileSync(reportFile)) : [];
        reports.push({
            user: sender.split("@")[0],
            message: args.join(" "),
            time
        });
        fs.writeFileSync(reportFile, JSON.stringify(reports, null, 2));

        // Envoie aux développeurs
        for (const number of devNumbers) {
            await conn.sendMessage(`${number}@s.whatsapp.net`, {
                text: reportText,
                mentions: [sender]
            });
        }

        reply(confirmation);
    } catch (error) {
        console.error("Report Error:", error);
        reply("❌ Failed to send your report.");
    }
});

//reportlist

