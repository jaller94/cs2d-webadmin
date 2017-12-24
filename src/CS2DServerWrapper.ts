import startGame from './CS2DRunner';

export default class CS2DServerWrapper {
	log: any;
	game: null | {stderr, stdin};
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

    start() {
        if (this.game) return 'Server already running';
        this.game = startGame();
        this.log.push('Starting server...');

        this.game.stderr.on('data', (data) => {
            this.serverErrors.push(data);
        });

        this.game.on('close', (code) => {
            this.log.push(`Server exited with code ${code}`);
            this.game = null;
        });
    }

    askToQuit() {
        console.log('Sending quit command to server');
        this.runCommand('quit');
    }

    player() {
        return this.players.slice(0);
    }

    runCommand(command: string) {
        if (!this.game) return 'No game running!';
        if (!command) return 'No command specified!';
        console.log(`Processing game command: ${command}`);
        this.game.stdin.write(command, 'utf8');
    }

    getServerLog() {
        return this.serverLog.slice(0);
    }

    getServerErrors() {
        return this.serverErrors.slice(0);
    }

    status() {
        if (this.game) {
            return 'running';
        }
        return 'stopped';
    }
};
