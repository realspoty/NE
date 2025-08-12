const { cmd } = require('../command');
const axios = require('axios');

// API Configuration
const API_KEY = 'da971cd23296425abb66293e6c8760f5';
const API_BASE_URL = 'https://api.football-data.org/v4/';

// Competitions Mapping
const competitions = {
    'CL': 'CL',   // Champions League
    'BL': 'BL1',  // Bundesliga
    'L1': 'FL1',  // Ligue 1
    'PD': 'PD',   // La Liga
    'SA': 'SA',   // Serie A
    'PL': 'PL'    // Premier League
};

cmd({
    pattern: "footpred",
    alias: ["match", "footpred"],
    desc: "[ᴜᴘᴄᴏᴍɪɴɢ ғᴏᴏᴛʙᴀʟʟ ᴘʀᴇᴅɪᴄᴛɪᴏɴs]",
    category: "sport",
    filename: __filename,
}, async (conn, mek, m, { from, sender, reply, isGroup, args }) => {
    try {
        const input = args[0]?.toUpperCase();
        
        // Check competition
        if (!input || !competitions[input]) {
            return reply(`⚠️ ᴘʟᴇᴀsᴇ sᴘᴇᴄɪғʏ ᴀ ᴠᴀʟɪᴅ ᴄᴏᴍᴘᴇᴛɪᴛɪᴏɴ:\n\n` +
                `• *ᴄʟ* - ᴄʜᴀᴍᴘɪᴏɴs ʟᴇᴀɢᴜᴇ\n` +
                `• *ʙʟ* - ʙᴜɴᴅᴇsʟɪɢᴀ\n` +
                `• *ʟ1* - ʟɪɢᴜᴇ 1\n` +
                `• *ᴘᴅ* - ʟᴀ ʟɪɢᴀ\n` +
                `• *sᴀ* - sᴇʀɪᴇ ᴀ\n` +
                `• *ᴘʟ* - ᴘʀᴇᴍɪᴇʀ ʟᴇᴀɢᴜᴇ\n\n` +
                `ᴇxᴀᴍᴘʟᴇ: .prediction PL`);
        }

        const competitionCode = competitions[input];
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Fetch matches
        const matchesResponse = await axios.get(`${API_BASE_URL}competitions/${competitionCode}/matches`, {
            headers: { 'X-Auth-Token': API_KEY },
            params: {
                dateFrom: formatDate(today),
                dateTo: formatDate(nextWeek)
            }
        });

        const matches = matchesResponse.data.matches;

        if (!matches || matches.length === 0) {
            return reply(`⛔ ɴᴏ ᴍᴀᴛᴄʜᴇs sᴄʜᴇᴅᴜʟᴇᴅ ᴛʜɪs ᴡᴇᴇᴋ ɪɴ ${getCompetitionName(input)}.`);
        }

        // Build message
        let message = `🔮 *${getCompetitionName(input).toUpperCase()} ᴘʀᴇᴅɪᴄᴛɪᴏɴs*\n\n` +
                      `📢 ɴᴏᴛᴇ: ᴛʜᴇsᴇ ᴘʀᴇᴅɪᴄᴛɪᴏɴs ᴀʀᴇ ʙᴀsᴇᴅ ᴏɴ sᴛᴀᴛɪsᴛɪᴄs ᴀɴᴅ ᴀʟɢᴏʀɪᴛʜᴍs\n` +
                      `ᴛʜᴇʏ ᴅᴏ ɴᴏᴛ ɢᴜᴀʀᴀɴᴛᴇᴇ ᴀᴄᴄᴜʀᴀᴄʏ. ʙᴇᴛ ᴡɪsᴇʟʏ!\n\n`;
        
        for (const match of matches) {
            if (match.status !== 'SCHEDULED') continue;
            
            const matchDate = new Date(match.utcDate);
            const dateStr = matchDate.toLocaleDateString('en-GB');
            const timeStr = matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            
            const homeTeam = match.homeTeam.shortName || match.homeTeam.name;
            const awayTeam = match.awayTeam.shortName || match.awayTeam.name;
            
            // Get team stats
            const [homeStats, awayStats] = await Promise.all([
                getTeamStats(match.homeTeam.id),
                getTeamStats(match.awayTeam.id)
            ]);
            
            // Calculate prediction
            const prediction = calculatePrediction(homeStats, awayStats);
            
            message += `▫️ *${homeTeam} 🆚 ${awayTeam}*\n` +
                      `📅 ${dateStr} ⏰ ${timeStr}\n` +
                      `🏠 ғᴏʀᴍ: ${homeStats.form} | 🏳️ ғᴏʀᴍ: ${awayStats.form}\n` +
                      `📊 ᴘʀᴇᴅɪᴄᴛɪᴏɴ: ${prediction.result} (${prediction.probability}%)\n` +
                      `⚽ ʟɪᴋᴇʟʏ sᴄᴏʀᴇ: ${prediction.score}\n` +
                      `💡 ᴛɪᴘ: ${prediction.advice}\n\n`;
        }

        message += `\n📈 ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴘᴏᴛʏ ᴍᴛғ`;
        await reply(message);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        reply('❌ ᴇʀʀᴏʀ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴘʀᴇᴅɪᴄᴛɪᴏɴs. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.');
    }
});

// Get team statistics
async function getTeamStats(teamId) {
    const response = await axios.get(`${API_BASE_URL}teams/${teamId}`, {
        headers: { 'X-Auth-Token': API_KEY }
    });
    
    return {
        form: response.data.form || '-----',
        wins: response.data.runningCompetitions[0]?.stats?.wins || 0,
        draws: response.data.runningCompetitions[0]?.stats?.draws || 0,
        losses: response.data.runningCompetitions[0]?.stats?.losses || 0,
        goalsFor: response.data.runningCompetitions[0]?.stats?.goalsFor || 0,
        goalsAgainst: response.data.runningCompetitions[0]?.stats?.goalsAgainst || 0
    };
}

// Prediction algorithm
function calculatePrediction(homeTeam, awayTeam) {
    // Home advantage
    const homeAdvantage = 15;
    
    // Base probabilities
    const homeWinProb = Math.min(70, homeAdvantage + (homeTeam.wins - awayTeam.losses) * 3);
    const drawProb = Math.min(40, 20 + (homeTeam.draws + awayTeam.draws) * 1.5);
    const awayWinProb = Math.min(65, (awayTeam.wins - homeTeam.losses) * 3);
    
    // Normalize
    const total = homeWinProb + drawProb + awayWinProb;
    const normalizedHome = Math.round((homeWinProb / total) * 100);
    const normalizedDraw = Math.round((drawProb / total) * 100);
    const normalizedAway = Math.round((awayWinProb / total) * 100);
    
    // Determine outcome
    let result, probability;
    if (normalizedHome >= normalizedAway && normalizedHome >= normalizedDraw) {
        result = "ʜᴏᴍᴇ ᴡɪɴ";
        probability = normalizedHome;
    } else if (normalizedAway >= normalizedHome && normalizedAway >= normalizedDraw) {
        result = "ᴀᴡᴀʏ ᴡɪɴ";
        probability = normalizedAway;
    } else {
        result = "ᴅʀᴀᴡ";
        probability = normalizedDraw;
    }
    
    // Score prediction
    const homeAttack = (homeTeam.goalsFor / (homeTeam.wins + homeTeam.draws + homeTeam.losses)) || 1.4;
    const homeDefense = (homeTeam.goalsAgainst / (homeTeam.wins + homeTeam.draws + homeTeam.losses)) || 1.2;
    const awayAttack = (awayTeam.goalsFor / (awayTeam.wins + awayTeam.draws + awayTeam.losses)) || 1.3;
    const awayDefense = (awayTeam.goalsAgainst / (awayTeam.wins + awayTeam.draws + awayTeam.losses)) || 1.1;
    
    const homeGoals = Math.round((homeAttack + awayDefense) / 2 * (0.9 + Math.random() * 0.2));
    const awayGoals = Math.round((awayAttack + homeDefense) / 2 * (0.8 + Math.random() * 0.3));
    
    // Betting advice
    let advice;
    if (probability > 65) {
        advice = "sᴀғᴇ ʙᴇᴛ, ɢᴏᴏᴅ ᴏᴅᴅs";
    } else if (probability > 50) {
        advice = "ᴡᴏʀᴛʜ ᴄᴏɴsɪᴅᴇʀɪɴɢ";
    } else if (probability > 40) {
        advice = "ʀɪsᴋʏ ʙᴜᴛ ᴘᴏssɪʙʟᴇ";
    } else {
        advice = "ʙᴇᴛᴛᴇʀ ᴛᴏ ᴀᴠᴏɪᴅ";
    }
    
    return {
        result,
        probability,
        score: `${Math.max(0, homeGoals)}-${Math.max(0, awayGoals)}`,
        advice
    };
}

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
