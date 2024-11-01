import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Ganti dengan password yang benar
  database: 'your_data', // Ganti dengan nama database yang benar
});

export default pool; // Ekspor sebagai default
