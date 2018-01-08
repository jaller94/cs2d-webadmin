import { Player } from "./cs2d-lua-objects/player.d";

const regexJoin = /^WEBADM#JOIN#(.*?)#(.*?)#(.*?)#(.*?)#(.*?)#(.*?)#(.*?)#(.*?)#(.*)$/;
const regexLeave = /^WEBADM#LEAVE#(.*)$/;

export default class CS2DPlayers {
    botCount: number;
    humanCount: number;
    players: Player[];

    constructor() {
        this.botCount = 0;
        this.humanCount = 0;
        this.players = [];
    }

    printCounts() {
        console.log('bots', this.botCount, 'humans', this.humanCount);
    }

    processLine(line: string): void {
        console.log('players line', line);
        if (regexJoin.test(line)) {
            const id = this.processPlayerJoin(line);
            if (id) {
                console.log(this.players[id].name + ' joined!');
            }
            this.printCounts();
        } else if (regexLeave.test(line)) {
            this.processPlayerLeave(line);
            this.printCounts();
        }
    }

    processPlayerJoin(line: string): void | number {
        const match = line.match(regexJoin);
        if (match) {
            const id = Number.parseInt(match[1]);
            const player = {
                bot: (match[2] === 't' ? true : false),
                name: match[3],
                ip: match[4],
                port: Number.parseInt(match[5]),
                usgn: Number.parseInt(match[6]),
                usgnname: match[7],
                steamid: match[8],
                steamname: match[9],
            };
            this.players[id] = player;
            if (player.bot) {
                this.botCount++;
            } else {
                this.humanCount++;
            }
            return id;
        }
    }

    processPlayerLeave(line: string): void | number {
        const match = line.match(regexLeave);
        if (match) {
            const id = Number.parseInt(match[1]);
            const player = this.players[id];
            if (player) {
                if (player.bot) {
                    this.botCount--;
                } else {
                    this.humanCount--;
                }
            } else {
                console.error('Unknown player left', id);
            }
            delete this.players[id];
            return id;
        }
    }

    getPlayer(id: number): void | Player {
        const player = this.players[id];
        if (!player) return;
        return Object.assign({}, player);
    }
};
