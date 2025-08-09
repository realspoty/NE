const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({ 
    pattern: "lyrics", 
    alias: ["lyric", "paroles"], 
    react: "📜", 
    desc: "Get song lyrics", 
    category: "main", 
    use: '.lyrics <song name>', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply('🔍 Please enter the song name to get the lyrics! Usage: *lyrics <song name>*');
        
        // Fetch song lyrics using the some-random-api.com API
        const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(q)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        
        if (!json.lyrics) {
            return await reply(`❌ Sorry, I couldn't find any lyrics for "${q}".`);
        }
        
        // Sending the formatted result to the user
        await conn.sendMessage(from, {
            text: `🎵 *Song Lyrics* 🎶\n\n▢ *Title:* ${json.title || q}\n▢ *Artist:* ${json.author || 'Unknown'}\n\n📜 *Lyrics:*\n${json.lyrics}\n\nHope you enjoy the music! � 🎶`
        }, { quoted: mek });

    } catch (error) {
        console.error('Error in lyrics command:', error);
        await reply(`❌ An error occurred while fetching the lyrics for "${q}".`);
    }
});
