const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('config');

const jwtSecret = config.get('jwtSecret');
const nodemailer = require('nodemailer');

//  Register a user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists, please try to login.' });
    }

    user = new User({ username, email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const registerResult = { user: { id: user.id } };
    jwt.sign(registerResult, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//  Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist, please register.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials, please try again.' });
    }
    const loginResult = { user: { id: user.id } };
    jwt.sign(loginResult, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, id: user.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//  Send verification email
exports.sendVerificationEmail = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User does not exist, please register.');
  }

  const userId = user._id;
  const resetToken = crypto.randomBytes(32).toString('hex');

  //  Token will expire in 10 minutes
  const signedToken = jwt.sign({ userId, resetToken }, process.env.JWT_SECRET, { expiresIn: 3600 });
  const resetLink = `http://localhost:3000/forgot-password?token=${signedToken}`;

  //  Setup transporter with Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.GMAIL_USER_EMAIL,
      pass: process.env.GMAIL_USER_APP_PASSWORD,
    },
  });
  transporter.verify().then(console.log).catch(console.error);

  //  Create email message
  const emailMessage = { 
    from: 'Page Pilot <pagepilot@gmail.com>',
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}. The link will expire in 10 minutes.`
  }

  try {
    const status = await transporter.sendMail(emailMessage);
    console.log('Email sent: ' + status.response);
    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email: ' + error.message);
    return res.status(500).json({ message: 'Error sending email' });
  }
};

//  Reset user password
exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    let user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist, please register.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'User password updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};