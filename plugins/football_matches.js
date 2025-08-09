const { cmd } = require('../command');
const axios = require('axios');

// API Configuration
const API_KEY = 'da971cd23296425abb66293e6c8760f5';
const API_BASE_URL = 'https://api.football-data.org/v4/';

// Competitions Mapping
const competitions = {
    'CL': 'CL',   // Champions League
    'ʙʟ': 'ʙʟ1', // Bundesliga
    'ʟ1': 'ꜰʟ1', // Ligue 1
    'ʟʟ': 'ᴘᴅ',   // La Liga
    'ꜱᴀ': 'ꜱᴀ',   // Serie A
    'ᴘʟ': 'ᴘʟ'    // Premier League
};

cmd({
    pattern: "matches",
    alias: ["match", "football"],
    desc: "ᴜᴘᴄᴏᴍɪɴɢ ғᴏᴏᴛʙᴀʟʟ ᴍᴀᴛᴄʜᴇs",
    category: "sport",
    filename: __filename,
}, async (conn, mek, m, { from, sender, reply, isGroup, args }) => {
    try {
        const input = args[0]?.toUpperCase();
        
        // Check requested league
        if (!input || !competitions[input]) {
            return reply(`⚠️ ᴘʟᴇᴀsᴇ sᴘᴇᴄɪғʏ ᴀ ᴠᴀʟɪᴅ ᴄᴏᴍᴘᴇᴛɪᴛɪᴏɴ:\n\n` +
                `• *CL* - Champions League\n` +
                `• *BL1* - Bundesliga\n` +
                `• *FL1* - Ligue 1\n` +
                `• *PD* - La Liga\n` +
                `• *SA* - Serie A\n` +
                `• *PL* - Premier League\n\n` +
                `Example: .matches PL`);
        }

        const competitionCode = competitions[input];
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Fetch matches
        const response = await axios.get(`${API_BASE_URL}competitions/${competitionCode}/matches`, {
            headers: {
                'X-Auth-Token': API_KEY
            },
            params: {
                dateFrom: formatDate(today),
                dateTo: formatDate(nextWeek)
            }
        });

        const matches = response.data.matches;

        if (!matches || matches.length === 0) {
            return reply(`No matches scheduled this week in ${getCompetitionName(input)}.`);
        }

        // Build message
        let message = `⚽ *Schedule - ${getCompetitionName(input)}*\n\n`;
        
        matches.forEach(match => {
            const matchDate = new Date(match.utcDate);
            const dateStr = matchDate.toLocaleDateString('en-GB');
            const timeStr = matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            
            const homeTeam = match.homeTeam.shortName || match.homeTeam.name;
            const awayTeam = match.awayTeam.shortName || match.awayTeam.name;
            
            let scoreLine = '';
            if (match.status === 'FINISHED') {
                scoreLine = `🔴 Final score: ${match.score.fullTime.home} - ${match.score.fullTime.away}`;
            } else if (match.status === 'IN_PLAY') {
                scoreLine = `🟢 Live: ${match.score.fullTime.home ?? '0'} - ${match.score.fullTime.away ?? '0'}`;
            } else {
                scoreLine = `⏳ Upcoming match`;
            }
            
            message += `▫️ *${homeTeam} 🆚 ${awayTeam}*\n` +
                      `📅 ${dateStr} ⏰ ${timeStr}\n` +
                      `${scoreLine}\n\n`;
        });

        message += `\nData provided by Football-Data.org`;
        await reply(message);

    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        reply('❌ An error occurred while fetching matches. Please try again later.');
    }
});

// Utility functions
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getCompetitionName(code) {
    const names = {
        'CL': 'Champions League',
        'BL1': 'Bundesliga',
        'FL1': 'Ligue 1',
        'PD': 'La Liga',
        'SA': 'Serie A',
        'PL': 'Premier League'
    };
    return names[code] || code;
  }
