import { UserRecord } from './users.d';

var records: UserRecord[] = [
    { id: 1, username: 'Jaller', password: 'hi', displayName: 'Christian', emails: [ { value: 'jaller@example.com' } ] },
];

export function findById(id: number, cb: (err: null | Error, user?: UserRecord) => void) {
    process.nextTick(function() {
        const idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

export function findByUsername(username: string, cb: (err: null | Error, record: null | UserRecord) => void) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};
