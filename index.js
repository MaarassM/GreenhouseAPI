const http = require('http');
const url = require('url');
const handlers = require('./handlers');

const port = 8080;

// Kreiranje HTTP servera
const server = http.createServer((req, res) => {
    const { method, headers } = req;
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rute za senzore
    if (method === 'GET' && pathname === '/sensors') {
        handlers.getAllSensors(req, res);
    } else if (method === 'POST' && pathname === '/sensors') {
        handlers.createSensor(req, res);
    } else if (method === 'PUT' && pathname.startsWith('/sensors/')) {
        handlers.updateSensor(req, res);
    } else if (method === 'DELETE' && pathname.startsWith('/sensors/')) {
        handlers.deleteSensor(req, res);

    // Rute za aktuatorske uređaje
    } else if (method === 'GET' && pathname === '/actuators') {
        handlers.getAllActuators(req, res);
    } else if (method === 'POST' && pathname === '/actuators') {
        handlers.createActuator(req, res);
    } else if (method === 'PUT' && pathname.startsWith('/actuators/')) {
        handlers.updateActuator(req, res);
    } else if (method === 'DELETE' && pathname.startsWith('/actuators/')) {
        handlers.deleteActuator(req, res);

    // Rute za očitanja senzora
    } else if (method === 'GET' && pathname.startsWith('/readings/')) {
        handlers.getReadingsBySensorId(req, res);
    } else if (method === 'POST' && pathname === '/readings') {
        handlers.createReading(req, res);
    // Rute za uređaje
} else if (method === 'GET' && pathname === '/devices') {
    handlers.getAllDevices(req, res);
} else if (method === 'POST' && pathname === '/devices') {
    handlers.createDevice(req, res);
} else if (method === 'PUT' && pathname.startsWith('/devices/')) {
    handlers.updateDevice(req, res);
} else if (method === 'DELETE' && pathname.startsWith('/devices/')) {
    handlers.deleteDevice(req, res);


    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
    
});

// Pokretanje servera
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
