import { format } from "date-fns";

class ActivityLogsDAL {

    async addToLog(client, task_id, user_id, logDate, status) {
        try {
            const addLogSql = "INSERT INTO activitylogs (task_id, user_id, log_date, status) VALUES ($1, $2, $3, $4) RETURNING *";
            const addLogValues = [task_id, user_id, format(logDate, "yyyy-MM-dd"), status];

            const log = await client.query(addLogSql, addLogValues);

            return log.rows[0];
        } catch (err) {
            throw err;
        }
    }
}

export default new ActivityLogsDAL();