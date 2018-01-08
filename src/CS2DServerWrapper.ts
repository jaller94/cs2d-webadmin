import startGame from './CS2DRunner';
import { ChildProcess } from "child_process";
import CS2DPlayers from "./CS2DPlayers";

export enum Status {
    running,
    stopped
};

export default class CS2DServerWrapper {
    log: any;
    game: null | ChildProcess;
    playersPlugin: null | CS2DPlayers;
    serverLog: string[];
    serverErrors: string[];

    constructor() {
        this.game;
        this.serverLog = [];
        this.serverErrors = [];
        this.log = [];
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
        this.playersPlugin = new CS2DPlayers();

        this.game.stdout.on('data', (data: string) => {
            const line = data.toString().slice(0, -1);
            if (this.playersPlugin) {
                this.playersPlugin.processLine(line);
            }
            this.serverLog.push(line);
        });

        this.game.stderr.on('data', (data: string) => {
            this.serverErrors.push(data);
        });

        this.game.on('close', (code: number) => {
            this.log.push(`Server exited with code ${code}`);
            this.game = null;
            this.playersPlugin = null;
        });
    }

    askToQuit(): void {
        console.log('Sending quit command to server');
        this.runCommand('quit');
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
