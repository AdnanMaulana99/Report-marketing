import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
});

// User model definition
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Password validation function
function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, and 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// API handler for resetting password
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;

  // Log the request body for debugging
  console.log("Request body:", req.body); 

  // Validate required fields
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  // Validate new password strength
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ error: 'New password does not meet security requirements' });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save(); // Save the updated user

    return res.json({ message: 'Password has been updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
}
