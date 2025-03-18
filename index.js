const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

app.use(bodyParser.json());

const SECRET_KEY = 'geyksonGwapo';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'condiments'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err) => {
        if (err) return res.status(500).send('Registration failed.');
        res.status(201).send('User registered successfully.');
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) return res.status(400).send('Invalid credentials.');

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(400).send('Invalid credentials.');

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

app.post('/api/logout', (req, res) => {
    res.send('User logged out successfully.');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Extract the token part only

    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
}

app.post('/api/assigned_entity', authenticateToken, (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO assigned_entities (name, description) VALUES (?, ?)';

    db.query(query, [name, description], (err) => {
        if (err) return res.status(500).send('Failed to create entity.');
        res.status(201).send('Entity created successfully.');
    });
});

app.get('/api/assigned_entity', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM assigned_entities';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Failed to fetch entities.');
        res.json(results);
    });
});

app.get('/api/assigned_entity/:id', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM assigned_entities WHERE id = ?';

    db.query(query, [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).send('Entity not found.');
        res.json(results[0]);
    });
});

app.put('/api/assigned_entity', authenticateToken, (req, res) => {
    const { id, name, description } = req.body;
    const query = 'UPDATE assigned_entities SET name = ?, description = ? WHERE id = ?';

    db.query(query, [name, description, id], (err) => {
        if (err) return res.status(500).send('Failed to update entity.');
        res.send('Entity updated successfully.');
    });
});

app.delete('/api/assigned_entity/:id', authenticateToken, (req, res) => {
    const query = 'DELETE FROM assigned_entities WHERE id = ?';

    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).send('Failed to delete entity.');
        res.send('Entity deleted successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
