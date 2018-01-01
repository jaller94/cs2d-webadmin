import { Router } from 'express';
import { json } from 'body-parser';
import { readFile, writeFile } from 'fs';
import * as util from 'util';

const router = Router();

router.use(json());

const configFiles = [
    'sys/bans.lst',
    'sys/mapcycle.cfg',
    'sys/server.cfg',
    'sys/serverinfo.txt',
    'sys/weapons_recoil.cfg',
];

function isConfigFile(path: string) {
    return configFiles.includes(path);
}

function isServerLuaFile(path: string) {
    return path.startsWith('sys/lua/');
}

router.get(/^\/(.*)/,
    function(req, res) {
        const filepath = req.params[0];
        console.log('filepath', filepath);
        if (isConfigFile(filepath)) {
            readFile('server/' + filepath, 'latin1', (err, data) => {
                res.set({ 'Content-Type': 'text/plain; charset=utf8' });
                if (err) res.end(err.message);
                res.end(data);
            })
        } else {
            res.status(403).end('Forbidden!');
        }
    }
);

router.post(/^\/(.*)/,
    function(req, res) {
        const filepath = req.params[0];
        if (typeof req.body.body !== 'string') {
            res.end('invalid format');
        } else if (isConfigFile(filepath)) {
            writeFile('server/' + filepath, req.body.body, 'latin1', (err) => {
                if (err) res.end(err.message);
                res.end('success');
            })
        } else {
            res.status(403).end('Forbidden!');
        }
    }
);

export default router;
