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


    async getTaskActivityLogs(client, task_id) {
        try {
            const getLogsSql = "SELECT a.* FROM activitylogs a inner join tasks t on a.task_id = t.id inner join users u on a.user_id = u.id WHERE a.task_id = $1 ORDER BY a.log_date DESC;";
            const getLogsValues = [task_id];

            const logs = await client.query(getLogsSql, getLogsValues);

            return logs.rows;
        } catch (err) {
            throw err;
        }
    }
}

export default new ActivityLogsDAL();