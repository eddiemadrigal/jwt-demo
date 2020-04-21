const express = require('express');
const jwt = require('jsonwebtoken');
const server = express();

// welcome route for the index
server.get('/api', (req, res) => {
  res.json({ message: 'API running ...' })
  res.send();
});

// this route is protected with a token with middleware
server.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({ 
        message: 'post created...',
        authData
      })
    }
  });
});

server.post('/api/login', (req, res) => {
  const user = { // assume the user has been authenticated
    id: 1,
    username: 'edmadrigal',
    email: 'edmadrigal@yahoo.com'
  }
  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({ // return the token
      token
    })
  });
});

function verifyToken(req, res, next) {
  // token should be sent in the header as value to Authorization
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = server;