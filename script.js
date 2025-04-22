const apiBaseUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    loadSensors();
    loadActuators();
    loadDevices(); 
});

// ------------------- LOAD SENSORS -------------------
function loadSensors() {
    console.log("Fetching sensors..."); // Debugging log

    fetch(`${apiBaseUrl}/sensors`)
        .then(response => response.json())
        .then(data => {
            console.log("Loaded sensors:", data); // Očekujemo ispis senzora u konzoli
            const tableBody = document.querySelector('#sensors-table tbody');
            tableBody.innerHTML = '';
            data.forEach(sensor => {
                const row = `
                    <tr>
                        <td>${sensor.ID_senzora}</td>
                        <td>${sensor.Naziv}</td>
                        <td>${sensor.Tip}</td>
                        <td>${sensor.Posljednje_očitanje || 'N/A'}</td>
                        <td>${sensor.Vrijeme_čitanja || 'N/A'}</td>
                        <td>
                            <button onclick="editSensor(${sensor.ID_senzora})">Edit</button>
                            <button onclick="deleteSensor(${sensor.ID_senzora})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Error loading sensors:', err));
}



// ------------------- ADD SENSOR -------------------
function addSensor() {
    const name = document.getElementById('sensor-name').value;
    const type = document.getElementById('sensor-type').value;
    const reading = document.getElementById('sensor-reading').value;
    const time = document.getElementById('sensor-time').value;

    const newSensor = {
        naziv: name,
        tip: type,
        posljednje_ocitanje: parseFloat(reading),
        vrijeme_citanja: time
    };

    fetch(`${apiBaseUrl}/sensors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSensor)
    })
    .then(() => {
        loadSensors();
    })
    .catch(err => console.error('Error adding sensor:', err));
}

// ------------------- EDIT SENSOR -------------------
function editSensor(id) {
    const rows = document.querySelectorAll("#sensors-table tbody tr");
    let selectedRow = null;
    rows.forEach(row => {
        if (row.children[0].textContent == id) {
            selectedRow = row;
        }
    });

    if (!selectedRow) {
        console.error(`Sensor with ID ${id} not found`);
        return;
    }

    const currentName = selectedRow.children[1].textContent;
    const currentType = selectedRow.children[2].textContent;
    const currentReading = selectedRow.children[3].textContent;
    const currentTime = selectedRow.children[4].textContent;

    selectedRow.innerHTML = `
        <td>${id}</td>
        <td><input type="text" id="edit-name-${id}" value="${currentName}"></td>
        <td><input type="text" id="edit-type-${id}" value="${currentType}"></td>
        <td><input type="number" id="edit-reading-${id}" value="${currentReading}"></td>
        <td><input type="datetime-local" id="edit-time-${id}" value="${currentTime}"></td>
        <td>
            <button onclick="saveSensor(${id})">Save</button>
            <button onclick="loadSensors()">Cancel</button>
        </td>
    `;
}

// ------------------- SAVE SENSOR -------------------
function saveSensor(id) {
    const newName = document.getElementById(`edit-name-${id}`).value;
    const newType = document.getElementById(`edit-type-${id}`).value;
    const newReading = document.getElementById(`edit-reading-${id}`).value;
    const newTime = document.getElementById(`edit-time-${id}`).value; // Dobivanje novog datuma i vremena

    const updatedSensor = {
        naziv: newName,
        tip: newType,
        posljednje_ocitanje: parseFloat(newReading),
        vrijeme_citanja: newTime // Postavljanje novog vremena očitanja
    };

    fetch(`${apiBaseUrl}/sensors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSensor)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Sensor updated:", data);
        loadSensors(); // Osvježavanje tablice
    })
    .catch(err => console.error('Error updating sensor:', err));
}


// ------------------- DELETE SENSOR -------------------
function deleteSensor(id) {
    fetch(`${apiBaseUrl}/sensors/${id}`, { method: 'DELETE' })
    .then(() => {
        loadSensors();
    })
    .catch(err => console.error('Error deleting sensor:', err));
}

// ------------------- LOAD ACTUATORS -------------------
function loadActuators() {
    fetch(`${apiBaseUrl}/actuators`)
        .then(response => response.json())
        .then(data => {
            console.log("Loaded actuators:", data); // Provjera u konzoli
            const tableBody = document.querySelector('#actuators-table tbody');
            tableBody.innerHTML = '';
            data.forEach(actuator => {
                const row = `
                    <tr>
                        <td>${actuator.ID_aktera}</td>
                        <td>${actuator.Naziv}</td>
                        <td>${actuator.Tip}</td>
                        <td>${actuator.Status}</td>
                        <td>
                            <button onclick="editActuator(${actuator.ID_aktera})">Edit</button>
                            <button onclick="deleteActuator(${actuator.ID_aktera})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Error loading actuators:', err));
}
// ------------------- ADD ACTUATOR -------------------
function addActuator() {
    const name = document.getElementById('actuator-name').value;
    const type = document.getElementById('actuator-type').value;
    const status = document.getElementById('actuator-status').value;

    const newActuator = {
        naziv: name,
        tip: type,
        status: status
    };

    fetch(`${apiBaseUrl}/actuators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActuator)
    })
    .then(() => {
        loadActuators();
    })
    .catch(err => console.error('Error adding actuator:', err));
}

// ------------------- EDIT ACTUATOR -------------------
function editActuator(id) {
    const rows = document.querySelectorAll("#actuators-table tbody tr");
    
    let selectedRow = null;
    rows.forEach(row => {
        if (row.children[0].textContent == id) {
            selectedRow = row;
        }
    });

    if (!selectedRow) {
        console.error(`Actuator with ID ${id} not found`);
        return;
    }

    const currentName = selectedRow.children[1].textContent;
    const currentType = selectedRow.children[2].textContent;
    const currentStatus = selectedRow.children[3].textContent;

    selectedRow.innerHTML = `
        <td>${id}</td>
        <td><input type="text" id="edit-actuator-name-${id}" value="${currentName}"></td>
        <td><input type="text" id="edit-actuator-type-${id}" value="${currentType}"></td>
        <td><input type="text" id="edit-actuator-status-${id}" value="${currentStatus}"></td>
        <td>
            <button onclick="saveActuator(${id})">Save</button>
            <button onclick="loadActuators()">Cancel</button>
        </td>
    `;
}
function saveActuator(id) {
    const newName = document.getElementById(`edit-actuator-name-${id}`).value;
    const newType = document.getElementById(`edit-actuator-type-${id}`).value;
    const newStatus = document.getElementById(`edit-actuator-status-${id}`).value;

    const updatedActuator = {
        naziv: newName,
        tip: newType,
        status: newStatus
    };

    fetch(`${apiBaseUrl}/actuators/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedActuator)
    })
    .then(() => {
        loadActuators(); 
    })
    .catch(err => console.error('Error updating actuator:', err));
}
function deleteActuator(id) {
    fetch(`${apiBaseUrl}/actuators/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        console.log('Actuator deleted:', data);
        loadActuators(); 
    })
    .catch(err => console.error('Error deleting actuator:', err));
}
// ------------------- LOAD DEVICES -------------------
function loadDevices() {
    fetch(`${apiBaseUrl}/devices`)
        .then(response => response.json())
        .then(data => {
            console.log('Loaded devices:', data); // 
            const tableBody = document.querySelector('#devices-table tbody');
            tableBody.innerHTML = ''; 
            data.forEach(device => {
                const row = `
                    <tr>
                        <td>${device.ID_uredaja}</td>
                        <td>${device.Naziv}</td>
                        <td>${device.Tip}</td>
                        <td>${device.Status}</td>
                        <td>
                            <button onclick="editDevice(${device.ID_uredaja})">Edit</button>
                            <button onclick="deleteDevice(${device.ID_uredaja})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Error loading devices:', err));
}


// ------------------- ADD DEVICE -------------------
function addDevice() {
    const name = document.getElementById('device-name').value;
    const type = document.getElementById('device-type').value;
    const status = document.getElementById('device-status').value;

    const newDevice = { naziv: name, tip: type, status: status };

    fetch(`${apiBaseUrl}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
    })
    .then(response => response.json())  
    .then(data => {
        console.log('Device added:', data); 
        loadDevices(); 
    })
    .catch(err => console.error('Error adding device:', err));
}


// ------------------- DELETE DEVICE -------------------
function deleteDevice(id) {
    fetch(`${apiBaseUrl}/devices/${id}`, { method: 'DELETE' })
    .then(() => {
        loadDevices();
    })
    .catch(err => console.error('Error deleting device:', err));
}
function editDevice(id) {
    const rows = document.querySelectorAll("#devices-table tbody tr");

    let selectedRow = null;
    rows.forEach(row => {
        if (row.children[0].textContent == id) {
            selectedRow = row;
        }
    });

    if (!selectedRow) {
        console.error(`Device with ID ${id} not found`);
        return;
    }

    const currentName = selectedRow.children[1].textContent;
    const currentType = selectedRow.children[2].textContent;
    const currentStatus = selectedRow.children[3].textContent;

    selectedRow.innerHTML = `
        <td>${id}</td>
        <td><input type="text" id="edit-device-name-${id}" value="${currentName}"></td>
        <td><input type="text" id="edit-device-type-${id}" value="${currentType}"></td>
        <td><input type="text" id="edit-device-status-${id}" value="${currentStatus}"></td>
        <td>
            <button onclick="saveDevice(${id})">Save</button>
            <button onclick="loadDevices()">Cancel</button>
        </td>
    `;
}
function saveDevice(id) {
    const newName = document.getElementById(`edit-device-name-${id}`).value;
    const newType = document.getElementById(`edit-device-type-${id}`).value;
    const newStatus = document.getElementById(`edit-device-status-${id}`).value;

    const updatedDevice = {
        naziv: newName,
        tip: newType,
        status: newStatus
    };

    fetch(`${apiBaseUrl}/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDevice)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Device updated:', data);
        loadDevices(); 
    })
    .catch(err => console.error('Error updating device:', err));
}





// ------------------- GLOBAL EXPORT -------------------
window.addSensor = addSensor;
window.addActuator = addActuator;
window.deleteSensor = deleteSensor;
window.deleteActuator = deleteActuator;
window.editSensor = editSensor;
window.editActuator = editActuator;
window.saveSensor = saveSensor;
window.saveActuator = saveActuator;
window.loadSensors = loadSensors;
window.loadActuators = loadActuators;
