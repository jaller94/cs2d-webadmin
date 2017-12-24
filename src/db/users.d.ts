export interface UserRecord {
    id: number;
    username: string;
    password: string;
    displayName: string;
    emails: {value: string}[];
}
