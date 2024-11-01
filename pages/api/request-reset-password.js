server.post('/api/request-reset-password', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // Token expires in 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`,
    });

    res.json({ message: 'Password reset link has been sent to your email' });
});
