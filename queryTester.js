import pool from "./config/db.config.js";

(async function () {
    const client = await pool.connect();
    try {
        const sql = "SELECT refresh_token FROM users WHERE id = $1"
        const values = ["c2113c76-bdb1-4a71-b495-8595237864a1"]
        const result = await client.query(sql, values);
        console.log(result.rows[0]);
    } catch (err) {

    } finally {
        client.release();
    }
})();