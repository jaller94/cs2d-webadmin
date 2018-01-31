import { createWriteStream, unlinkSync, WriteStream } from 'fs';
import { spawn, ChildProcess } from 'child_process';
import { Stream } from "stream";

function openStdInStream(path: string): WriteStream {
    unlinkSync(path);
    // Create file-based stream for the stdin
    process.stdout.write('Opening stdin stream... ');
    const stdin = createWriteStream(path);
    process.stdout.write('Done\n');
    return stdin;
}

function closeStdInStream(stream: WriteStream): void {
    process.stdout.write('Closing stdin stream... ');
    stream.close();
    process.stdout.write('Done\n');
}

export default function startGame(): void | ChildProcess {
    const stdin = openStdInStream('server/stdin.stream');

    process.stdout.write('Starting game server... ');
    const game = spawn('./server/cs2d_dedicated');
    if (!game) {
        process.stdout.write('Fail\n');
        return;
    }
    process.stdout.write('Done\n');

    game.on('close', (code) => {
        closeStdInStream(stdin);
    });

    game.stdin = stdin;

    return game;
};

/*
game.stdout.on('data', (data) => {
    process.stdout.write(`cs2d: ${data}`);
});
*/
