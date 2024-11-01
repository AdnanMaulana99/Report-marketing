import db from '../lib/db'; // Impor koneksi MySQL dari db.js

// Fungsi untuk mencari user berdasarkan email
export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.query(query, [email]);
  
  return rows[0]; // Mengembalikan user pertama yang ditemukan, atau undefined jika tidak ada
};

// Fungsi untuk membuat token (gunakan sesuai kebutuhan)
import { v4 as uuidv4 } from 'uuid';
export const generateToken = () => {
  return uuidv4(); // Menghasilkan token unik
};
