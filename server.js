// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const USERS_FILE = path.join(__dirname, 'users.json');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const KURS_FILE = path.join(__dirname, 'kurs.json');

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/api/login', (req, res) => {
  const users = loadJson(USERS_FILE);
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/api/register', (req, res) => {
  const users = loadJson(USERS_FILE);
  const { username, password } = req.body;
  if (users[username]) {
    res.json({ success: false });
  } else {
    users[username] = password;
    saveJson(USERS_FILE, users);
    res.json({ success: true });
  }
});

app.get('/api/kurs', (req, res) => {
  const kurs = JSON.parse(fs.readFileSync(KURS_FILE, 'utf-8'));
  res.json(kurs);
});

app.get('/api/progress', (req, res) => {
  const { user } = req.query;
  const progress = loadJson(PROGRESS_FILE);
  res.json(progress[user] || {});
});

app.post('/api/progress/save', (req, res) => {
  const { user, id, klar } = req.body;
  const progress = loadJson(PROGRESS_FILE);
  if (!progress[user]) progress[user] = {};
  progress[user][id] = klar;
  saveJson(PROGRESS_FILE, progress);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
