import mariadb from "mariadb";
import dotenv from "dotenv";
import errorLog from "../utils/errorLog.js";

dotenv.config();

const config = {
    dbName: "anima",
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
}

const pool = mariadb.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    supportBigNumbers: true,
    bigNumberStrings: true,
    connectionLimit: 20,
    connectTimeout: 10000,
    acquireTimeout: 10000,
});


const executeQuery = async (sql, params=[]) => {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(sql, params);
    } catch (error) {
        await errorLog(error);
        throw error;
    } finally {
        if (conn) await conn.release();
    }
};

const sqlGet = async (sql, params=[]) => {
    return await executeQuery(sql, params);
}

const sqlPost = async (sql, params=[]) => {
    await executeQuery(sql, params);
    return true
}

export {sqlGet, sqlPost}