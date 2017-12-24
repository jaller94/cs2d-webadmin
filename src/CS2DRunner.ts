import { createWriteStream } from 'fs';
import { spawn } from 'child_process';

export default function startGame(): {stderr, stdin} {
    // Create file-based stream for the stdin
    process.stdout.write('Opening stdin stream... ');
    const stdin = createWriteStream('server/stdin.stream');
    process.stdout.write('Done\n');

    process.stdout.write('Starting game server... ');
    const game = spawn('./server/cs2d_dedicated');
    if (!game) {
        process.stdout.write('Fail\n');
        return;
    }
    process.stdout.write('Done\n');

    game.on('close', (code) => {
        process.stdout.write('Closing stdin stream... ');
        stdin.close();
        process.stdout.write('Done\n');
    });

    game.stdin = stdin;

    return game;
};

/*
game.stdout.on('data', (data) => {
    process.stdout.write(`cs2d: ${data}`);
});
*/
