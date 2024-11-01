import db from '../../lib/db';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      // Ambil user berdasarkan email
      const [user] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

      // Cek apakah user ditemukan
      if (user) {
        
        
        // Cek apakah password ada
        if (user[0].password) {
          
          // Verifikasi password menggunakan bcrypt
      
          const isMatch = await bcrypt.compare(password, user[0].password);
          

          if (isMatch) {
            // Cek role pengguna setelah berhasil login
            const userRole = user[0].role;

            // Set cookie dengan token role
            res.setHeader(
              'Set-Cookie',
              cookie.serialize('token', userRole, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60, // Cookie berlaku selama 1 jam
                sameSite: 'strict',
                path: '/'
              })
            );

            // Kirim respon berdasarkan role pengguna
            console.log("nilai:", userRole)
            res.status(200).json({ role: userRole });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } else {
          res.status(401).json({ error: 'Password not found for user. Please check your database.' });
        }
      } else {
        res.status(401).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error logging in' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
