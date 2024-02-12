import pool from "./config/db.config.js";

// (async function () {
//     const client = await pool.connect();
//     try {
//         const sql = "SELECT * FROM users WHERE id = $1"
//         const values = ["c2113c76-bdb1-4a71-b495-8595237864a1"]
//         const result = await client.query(sql, values);
//         console.log(result.rows[0]);
//     } catch (err) {

//     } finally {
//         client.release();
//     }
// })();

// (async function () {
//     const client = await pool.connect();
//     try {
//         const sql = "SELECT refresh_token FROM users WHERE id = $1"
//         const values = ["c2113c76-bdb1-4a71-b495-8595237864a1"]
//         const result = await client.query(sql, values);
//         console.log(result.rows[0]);
//     } catch (err) {

//     } finally {
//         client.release();
//     }
// })();

(
    async function () {
        const client = await pool.connect();
        try {
            const sql = "SELECT p.id as project_id, p.*, t.* FROM projects p JOIN teams t ON p.team_id = t.id WHERE p.id = $1"
            const values = ["667d22ab-1bea-4741-8ff7-e7ddd8c0e1df"]
            const result = await client.query(sql, values);
            console.log(result.rows[0]);
        } catch (err) {

        } finally {
            client.release();
        }
    }
)();