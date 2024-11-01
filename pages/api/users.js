import db from '../../lib/db'; // Mengimpor koneksi ke database

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [users] = await db.query('SELECT * FROM users'); // Query untuk mendapatkan data user
      res.status(200).json(users); // Kirim data user sebagai respons
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
