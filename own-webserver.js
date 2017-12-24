const { createServer } = require('http');
const url = require('url');
const querystring = require('querystring');
const startGame = require('./game.js');

let game = null;

function startGameWrapper() {
    game = startGame();

    game.stderr.on('data', (data) => {
        process.stdout.write(`server err: ${data}`);
    });

    game.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        game = null;
    });

    /*setTimeout(() => {
        askServerToQuit(game);
    }, 5000);*/
}

function askServerToQuit(game) {
    console.log('Sending quit command to server');
    game.stdin.write('quit', 'utf8');
}

function runGameCommand(game, command) {
    console.log(`Processing game command: ${command}`);
    game.stdin.write(command, 'utf8');
}

createServer(function (req, res) {
    let msg = {};
    const urlObj = url.parse(req.url);
    if (urlObj.pathname === '/start') {
        if (game) {
            msg.success = false;
            msg.message = 'Server is already running.';
        } else {
            startGameWrapper();
            msg.success = true;
        }
    } else if (urlObj.pathname === '/stop') {
        if (game) {
            askServerToQuit(game);
            msg.success = true;
        } else {
            msg.success = false;
            msg.message = 'Server is not running.';
        }
    } else if (urlObj.pathname === '/cmd') {
        if (!game) {
            msg.success = false;
            msg.message = 'Server is not running.';
        } else {
            const queryObj = querystring.parse(urlObj.query);
            if (!queryObj || !queryObj.command) {
                msg.success = false;
                msg.message = 'No command given.';
            } else {
                runGameCommand(game, queryObj.command);
                msg.success = true;
            }
        }
    } else {
        msg.success = false;
        msg.message = 'Action unknown.';
    }
    const data = JSON.stringify(msg);
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
    });
    res.write(data);
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
