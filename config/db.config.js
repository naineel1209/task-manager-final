import { config } from 'dotenv';
config();
import pg from 'pg'

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskmanager',
    password: '123456',
    port: 5432,
    searchPath: ['publix', 'public'],
});

export default pool;