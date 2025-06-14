const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db'); // <<== new

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('🔌 A user connected');

  socket.on('join', ({ userId, userName }) => {
    socket.data.userId = userId;
    socket.data.userName = userName;
    console.log(`✅ ${userName} joined`);
  });

  socket.on('chat_message', (msg) => {
    const userId = socket.data.userId;
    const userName = socket.data.userName;

    // Save to MySQL
    const sql = 'INSERT INTO messages (user_id, user_name, message) VALUES (?, ?, ?)';
    db.query(sql, [userId, userName, msg], (err) => {
      if (err) {
        console.error('❌ Error saving message:', err);
      } else {
        console.log('💾 Message saved to DB');
      }
    });

    // Broadcast to all
    io.emit('chat_message', {
      userId,
      userName,
      message: msg,
      timestamp: new Date()
    });
  });
});

app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY timestamp ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch messages:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});


server.listen(3000, () => {
  console.log('✅ Server is listening on port 3000');
});
