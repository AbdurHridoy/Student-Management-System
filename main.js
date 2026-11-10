const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(app.getPath('userData'), 'students.json');

function readStudents() {
    try {
        if (!fs.existsSync(dataPath)) {
            return [];
        }

        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
        console.error('Error reading students:', error);
        return [];
    }
}

function saveStudents(students) {
    fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

ipcMain.handle('get-students', () => {
    return readStudents();
});

ipcMain.handle('add-student', (event, student) => {
    const students = readStudents();
    student.id = Date.now().toString();
    students.push(student);
    saveStudents(students);
    return students;
});

ipcMain.handle('update-student', (event, updatedStudent) => {
    const students = readStudents();

    const updated = students.map(student =>
        student.id === updatedStudent.id ? updatedStudent : student
    );

    saveStudents(updated);
    return updated;
});

ipcMain.handle('delete-student', (event, id) => {
    const students = readStudents();
    const updated = students.filter(student => student.id !== id);

    saveStudents(updated);
    return updated;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});