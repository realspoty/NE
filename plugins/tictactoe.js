const { cmd } = require('../command');
const activeGames = {};

cmd({
    pattern: "ttt",
    alias: ['tictactoe', 'xo'],
    desc: "Start a Tic Tac Toe game",
    category: "game",
    filename: __filename,
}, async (conn, m, { from, sender, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups!");
        if (activeGames[from]) return reply("⚠️ There's already an active game in this group!");

        // Create new game
        activeGames[from] = {
            board: Array(9).fill(' '),
            player1: sender,
            player2: null,
            currentTurn: 'X',
            active: true,
            timeout: setTimeout(() => {
                if (activeGames[from]) {
                    conn.sendMessage(from, { text: "⌛ Game session expired due to inactivity." });
                    delete activeGames[from];
                }
            }, 5 * 60 * 1000) // 5 minutes timeout
        };

        const game = activeGames[from];
        const boardStr = drawBoard(game.board);

        await conn.sendMessage(from, {
            text: `🎮 *Tic Tac Toe Game Started!*\n\n` +
                  `Player X: @${sender.split('@')[0]}\n` +
                  `Waiting for player O to join...\n\n` +
                  `${boardStr}\n\n` +
                  `Type *join* to play against @${sender.split('@')[0]}`,
            mentions: [sender]
        });

    } catch (error) {
        console.error('TicTacToe error:', error);
        reply('❌ Error starting game. Please try again.');
    }
});

// Helper function to draw the board
function drawBoard(board) {
    return [
        ` ${board[0] || '1'} │ ${board[1] || '2'} │ ${board[2] || '3'}`,
        '───┼───┼───',
        ` ${board[3] || '4'} │ ${board[4] || '5'} │ ${board[5] || '6'}`,
        '───┼───┼───',
        ` ${board[6] || '7'} │ ${board[7] || '8'} │ ${board[8] || '9'}`
    ].join('\n');
}

// Function to check for winner
function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

// Handle game moves
cmd({
    on: "text",
    fromMe: false
}, async (m, conn) => {
    const { from, sender, body } = m;
    if (!activeGames[from]) return;

    const game = activeGames[from];
    
    // Handle player joining
    if (body.toLowerCase() === 'join' && !game.player2 && sender !== game.player1) {
        game.player2 = sender;
        game.currentTurn = 'X'; // Player1 (X) starts
        
        const boardStr = drawBoard(game.board);
        
        await conn.sendMessage(from, {
            text: `🎮 *Game Ready!*\n\n` +
                  `Player X: @${game.player1.split('@')[0]}\n` +
                  `Player O: @${game.player2.split('@')[0]}\n\n` +
                  `${boardStr}\n\n` +
                  `It's @${game.player1.split('@')[0]}'s turn (X)\n` +
                  `Type a number (1-9) to make your move`,
            mentions: [game.player1, game.player2]
        });
        return;
    }

    // Handle game moves (1-9)
    if (/^[1-9]$/.test(body) && game.player2) {
        const player = sender === game.player1 ? 'X' : 
                      sender === game.player2 ? 'O' : null;
        
        if (!player || player !== game.currentTurn) {
            await conn.sendMessage(from, { 
                text: `❌ Not your turn!`, 
                mentions: [sender] 
            });
            return;
        }

        const position = parseInt(body) - 1;
        
        if (game.board[position] !== ' ') {
            await conn.sendMessage(from, { 
                text: `❌ Position already taken!`, 
                mentions: [sender] 
            });
            return;
        }

        // Make the move
        game.board[position] = player;
        const boardStr = drawBoard(game.board);

        // Check for winner
        if (checkWin(game.board, player)) {
            await conn.sendMessage(from, {
                text: `🎉 *@${sender.split('@')[0]} wins!* (${player})\n\n` +
                      `${boardStr}\n\n` +
                      `Game over!`,
                mentions: [sender]
            });
            clearTimeout(game.timeout);
            delete activeGames[from];
            return;
        }

        // Check for tie
        if (!game.board.includes(' ')) {
            await conn.sendMessage(from, {
                text: `🤝 *Game ended in a draw!*\n\n` +
                      `${boardStr}\n\n` +
                      `Game over!`,
                mentions: [game.player1, game.player2]
            });
            clearTimeout(game.timeout);
            delete activeGames[from];
            return;
        }

        // Switch turns
        game.currentTurn = player === 'X' ? 'O' : 'X';
        const nextPlayer = game.currentTurn === 'X' ? game.player1 : game.player2;

        await conn.sendMessage(from, {
            text: `🔹 *Move accepted!*\n\n` +
                  `${boardStr}\n\n` +
                  `It's @${nextPlayer.split('@')[0]}'s turn (${game.currentTurn})\n` +
                  `Type a number (1-9) to make your move`,
            mentions: [nextPlayer]
        });

    } else if (body.toLowerCase() === 'surrender' && game.player2) {
        // Handle surrender
        const winner = sender === game.player1 ? game.player2 : game.player1;
        
        await conn.sendMessage(from, {
            text: `🏳️ @${sender.split('@')[0]} surrendered!\n` +
                  `🎉 @${winner.split('@')[0]} wins the game!`,
            mentions: [sender, winner]
        });
        
        clearTimeout(game.timeout);
        delete activeGames[from];
    }
});
