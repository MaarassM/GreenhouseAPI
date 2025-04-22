const sqlite3 = require('sqlite3').verbose();
const url = require('url');

const db = new sqlite3.Database('./test.db');

const parseBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);
            callback(parsedBody);
        } catch (err) {
            callback(null, err);
        }
    });
};

// 📌 --- CRUD operacije za SENZORE ---
exports.getAllSensors = (req, res) => {
    db.all(`SELECT * FROM Senzori`, [], (err, rows) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        }
    });
};

exports.createSensor = (req, res) => {
    parseBody(req, (data, err) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            return;
        }

        const { naziv, tip, posljednje_ocitanje, vrijeme_citanja } = data;

        if (!naziv || !tip || posljednje_ocitanje === undefined || !vrijeme_citanja) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields' }));
            return;
        }

        db.run(
            `INSERT INTO Senzori (Naziv, Tip, Posljednje_očitanje, Vrijeme_čitanja) VALUES (?, ?, ?, ?)`,
            [naziv, tip, posljednje_ocitanje, vrijeme_citanja],
            function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ id: this.lastID }));
                }
            }
        );
    });
};

exports.updateSensor = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    parseBody(req, (body) => {
        const { naziv, tip, posljednje_ocitanje, vrijeme_citanja } = body;
        db.run(
            `UPDATE Senzori SET Naziv = ?, Tip = ?, Posljednje_očitanje = ?, Vrijeme_čitanja = ? WHERE ID_senzora = ?`,
            [naziv, tip, posljednje_ocitanje, vrijeme_citanja, id],
            function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Sensor updated successfully' }));
                }
            }
        );
    });
};

exports.deleteSensor = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    db.run(`DELETE FROM Senzori WHERE ID_senzora = ?`, [id], function (err) {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Sensor deleted successfully' }));
        }
    });
};

// 📌 --- CRUD operacije za AKTUATORE ---
exports.getAllActuators = (req, res) => {
    db.all(`SELECT * FROM Aktuatori`, [], (err, rows) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        }
    });
};

exports.createActuator = (req, res) => {
    parseBody(req, (body) => {
        const { naziv, tip, status } = body;
        db.run(
            `INSERT INTO Aktuatori (Naziv, Tip, Status, Datum_vrijeme) VALUES (?, ?, ?, datetime('now'))`,
            [naziv, tip, status],
            function (err) {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ id: this.lastID }));
                }
            }
        );
    });
};

exports.updateActuator = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    parseBody(req, (body) => {
        const { naziv, tip, status } = body;
        db.run(
            `UPDATE Aktuatori SET Naziv = ?, Tip = ?, Status = ? WHERE ID_aktera = ?`,
            [naziv, tip, status, id],
            function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Actuator updated successfully' }));
                }
            }
        );
    });
};

exports.deleteActuator = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    db.run(`DELETE FROM Aktuatori WHERE ID_aktera = ?`, [id], function (err) {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Actuator deleted successfully' }));
        }
    });
};
// 📌 --- CRUD operacije za UREĐAJE ---
exports.getAllDevices = (req, res) => {
    db.all(`SELECT * FROM Uredaji`, [], (err, rows) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        }
    });
};

exports.createDevice = (req, res) => {
    parseBody(req, (data, err) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            return;
        }

        const { naziv, tip, status } = data;

        if (!naziv || !tip || !status) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields' }));
            return;
        }

        db.run(
            `INSERT INTO Uredaji (Naziv, Tip, Status) VALUES (?, ?, ?)`,
            [naziv, tip, status],
            function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ id: this.lastID }));
                }
            }
        );
    });
};

exports.updateDevice = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    parseBody(req, (body) => {
        const { naziv, tip, status } = body;
        db.run(
            `UPDATE Uredaji SET Naziv = ?, Tip = ?, Status = ? WHERE ID_uredaja = ?`,
            [naziv, tip, status, id],
            function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Device updated successfully' }));
                }
            }
        );
    });
};

exports.deleteDevice = (req, res) => {
    const id = url.parse(req.url, true).pathname.split('/')[2];
    db.run(`DELETE FROM Uredaji WHERE ID_uredaja = ?`, [id], function (err) {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Device deleted successfully' }));
        }
    });
};
