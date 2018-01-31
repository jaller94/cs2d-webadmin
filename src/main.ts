import * as express from 'express';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { ensureLoggedIn } from 'connect-ensure-login';

import CS2DServerWrapper from './CS2DServerWrapper.js';
import * as db from './db/index';
import { UserRecord } from "./db/users.d";

passport.use(new Strategy(
    function(username: string, password: string, cb) {
        db.users.findByUsername(username, (err: null | Error, user: null | UserRecord) => {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user: UserRecord, cb: (err: null | Error, id?: number) => void) {
    cb(null, user.id);
});

passport.deserializeUser(function(id: number, cb) {
    db.users.findById(id, (err: null | Error, user?: UserRecord) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

const app = express();
app.use(helmet());

const rootFolder = __dirname + '/..';
// Configure view engine to render EJS templates.
app.set('views', rootFolder + '/views');
app.set('view engine', 'ejs');
app.use('/css', express.static(rootFolder + '/www/css'));
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',
    function(req, res) {
        res.render('home', { user: req.user });
    }
);

app.get('/login',
    function(req, res){
        res.render('login');
    }
);

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    }
);

app.get('/profile',
    ensureLoggedIn(),
    function(req, res) {
        res.render('profile', { user: req.user });
    }
);

app.get('/config',
    ensureLoggedIn(),
    function(req, res) {
        res.render('config', { user: req.user });
    }
);

app.get('/console',
    ensureLoggedIn(),
    function(req, res) {
        res.render('console', { user: req.user });
    }
);

app.get('/players',
    ensureLoggedIn(),
    function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        if (cs2d.playersPlugin) {
            res.end(JSON.stringify({
                players: cs2d.playersPlugin.players,
                success: true,
            }));
        } else {
            res.end(JSON.stringify({
                success: false,
            }));
        }
    }
);

app.get('/start',
    ensureLoggedIn(),
    function(req, res) {
        console.log('cs2d start', cs2d.start());
        res.end();
    }
);

app.get('/stop',
    ensureLoggedIn(),
    function(req, res) {
        cs2d.askToQuit();
        res.end();
    }
);

app.get('/kick/1',
    ensureLoggedIn(),
    function(req, res) {
        cs2d.runCommand('kick 1');
        res.end();
    }
);

app.post('/message',
    ensureLoggedIn(),
    function(req, res) {
        let success = false;
        if (req.body && req.body.message) {
            cs2d.runCommand('msg ' + req.body.message);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success }));
    }
);

import routerFileSystem from './router-filesystem';

app.use('/filesystem', ensureLoggedIn(), routerFileSystem);

app.listen(3000);

var cs2d = new CS2DServerWrapper();
