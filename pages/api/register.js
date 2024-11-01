import bcrypt from 'bcrypt';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, email } = req.body;

    // Validasi input
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.query(
        'INSERT INTO users (name, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email]
      );
      return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error registering user.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
