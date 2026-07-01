import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const [, , name = 'Administrador', email = 'admin@imec.com.br', password = 'Admin@123'] = process.argv;
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'imec_site',
  namedPlaceholders: true
});
const password_hash = await bcrypt.hash(password, 12);
await pool.execute('INSERT INTO users (name,email,password_hash) VALUES (:name,:email,:password_hash) ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash)', { name, email, password_hash });
console.log(`Administrador pronto: ${email}`);
await pool.end();
