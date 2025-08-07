const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
  pattern: 'update',
  alias: ['upgrade', 'update'],
  react: '🆕',
  desc: 'Update the bot to the latest version.',
  category: 'misc',
  filename: __filename,
}, async (conn, mek, m, { reply, isOwner }) => {
  if (!isOwner) return reply('This command is only for the bot owner.');

  try {
    await reply('🔍 Checking for SPOTY-XMD updates...');

    // 📥 Obtenir le dernier commit depuis GitHub
    const { data: latestCommit } = await axios.get('https://api.github.com/repos/spotymtf/SPOTY-XMD/commits/main');
    const latestSha = latestCommit.sha;
    const currentSha = await getCommitHash();

    // ✅ Si aucune mise A jour
    if (latestSha === currentSha) {
      return reply('✅ YOUR SPOTY-XMD BOT IS ALREADY UP-TO-DATE!');
    }

    // 🧰 Téléchargement de la nouvelle archive
    await reply('SPOTY-XMD UPDATING WAIT PLEASE...');
    const zipPath = path.join(__dirname, 'latest.zip');
    const { data: zipBuffer } = await axios.get(
      'https://github.com/spotymtf/SPOTY-XMD/archive/main.zip',
      { responseType: 'arraybuffer' }
    );

    fs.writeFileSync(zipPath, zipBuffer);
    await reply('📦 Extracting the latest code...');

    // 📦 Décompression
    const extractPath = path.join(__dirname, 'latest');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    await reply('🔄 Replacing files...');
    const extractedFolder = path.join(extractPath, 'SPOTY-XMD-main');
    const botRoot = path.join(__dirname, '..');

    // 🔁 Fonction récursive de remplacement des fichiers (sauf fichiers sensibles)
    copyFolderSync(extractedFolder, botRoot);

    // 💾 Enregistrer le nouveau SHA
    await setCommitHash(latestSha);

    // 🧹 Nettoyage
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    await reply('✅ Update complete! Restarting the bot...');
    process.exit(0);

  } catch (err) {
    console.error('Update error:', err);
    return reply('❌ Update failed. Please try manually.');
  }
});
