import { Pool } from "pg";
import dotenv from "dotenv";


dotenv.config();

export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "complaint_management_system",
    password: "ccms123",
    port: 5432,
});