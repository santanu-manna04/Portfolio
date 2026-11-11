// Usage: npm run create-admin
// Creates the single admin account. The password is typed here (hidden) and is never stored in
// .env files, source code or shell history. Refuses to run if an admin already exists.
require('../config/env');
const readline = require('readline');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const ask = (question, hidden = false) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (rl.muted && !/[\r\n]/.test(s)) rl.output.write('*');
      else rl.output.write(s);
    };
    rl.question(question, (answer) => { rl.close(); resolve(answer); });
    rl.muted = hidden;
  });

(async () => {
  await connectDB();
  if (await User.exists({ role: 'admin' })) {
    console.error('An admin account already exists. Nothing was changed.');
    return;
  }
  const name = (await ask('Admin name: ')).trim();
  const email = (await ask('Admin email: ')).trim().toLowerCase();
  const password = await ask('Password (min 12 chars): ', true);
  const confirm = await ask('Confirm password: ', true);

  if (name.length < 2) throw new Error('Name must be at least 2 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  if (password !== confirm) throw new Error('Passwords do not match.');

  await User.create({ name, email, passwordHash: await User.hashPassword(password), role: 'admin' });
  console.log(`Admin created: ${email}`);
})()
  .catch((e) => { console.error(`Failed: ${e.message}`); process.exitCode = 1; })
  .finally(() => mongoose.connection.close());
