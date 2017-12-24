import startGame from './CS2DRunner';
import { ChildProcess } from "child_process";

export enum Status {
    running,
    stopped
};

export default class CS2DServerWrapper {
    log: any;
    game: null | ChildProcess;
    players: string[];
    serverLog: string[];
    serverErrors: string[];

    constructor() {
        this.game;
        this.serverLog = [];
        this.serverErrors = [];
        this.log = [];
        this.players = [];
    }

    start(): void | string {
        if (this.game) return 'Server already running';
        const childProcess = startGame();
        if (!childProcess) {
            this.log.push('Failed starting server child process!');
            return;
        }

        this.log.push('Started server!');
        this.game = childProcess;

        this.game.stderr.on('data', (data: string) => {
            this.serverErrors.push(data);
        });

        this.game.on('close', (code: number) => {
            this.log.push(`Server exited with code ${code}`);
            this.game = null;
        });
    }

    askToQuit(): void {
        console.log('Sending quit command to server');
        this.runCommand('quit');
    }

    player(): string[] {
        return this.players.slice(0);
    }

    runCommand(command: string): void | string {
        if (!this.game) return 'No game running!';
        if (!command) return 'No command specified!';
        console.log(`Processing game command: ${command}`);
        this.game.stdin.write(command, 'utf8');
    }

    getServerLog(): string[] {
        return this.serverLog.slice(0);
    }

    getServerErrors(): string[] {
        return this.serverErrors.slice(0);
    }

    status(): Status {
        if (this.game) {
            return Status.running;
        }
        return Status.stopped;
    }
};
