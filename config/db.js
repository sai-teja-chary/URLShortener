import 'dotenv/config'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
})


export const db = drizzle(pool)
