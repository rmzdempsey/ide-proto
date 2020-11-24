"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var win;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 1000, height: 800, webPreferences: { nodeIntegration: true } });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/ide3/index.html"),
        protocol: 'file:',
        slashes: true,
    }));
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
function getTemplates() {
    fs.readdir('./templates', { withFileTypes: true }, function (err, files) {
        if (!err) {
            var templateFiles = files
                .filter(function (file) { return !file.isDirectory(); })
                .map(function (file) { return JSON.parse(fs.readFileSync('./templates/' + file.name, "utf8")); });
            win.webContents.send("getTemplatesResponse", templateFiles);
        }
    });
}
electron_1.ipcMain.on("getTemplates", function (event) {
    getTemplates();
});
function getProjects() {
    var homedir = require('os').homedir();
    fs.readdir(homedir + '/dtp-ide', { withFileTypes: true }, function (err, files) {
        if (!err) {
            var projectFiles = files
                .filter(function (file) { return file.isDirectory() && !file.name.startsWith("."); })
                .map(function (file) { return JSON.parse(fs.readFileSync(homedir + '/dtp-ide/' + file.name + '/project.json', "utf8")); });
            win.webContents.send("getProjectsResponse", projectFiles);
        }
    });
}
electron_1.ipcMain.on("getProjects", function (event) {
    getProjects();
});
electron_1.ipcMain.on("createProject", function (event, projectName, templates) {
    var project = {
        name: projectName,
        templates: templates
    };
    var homedir = require('os').homedir();
    fs.mkdir(homedir + '/dtp-ide/' + projectName, { recursive: true }, function (err) {
        if (err)
            throw err;
        var data = new Uint8Array(Buffer.from(JSON.stringify(project)));
        fs.writeFile(homedir + '/dtp-ide/' + projectName + '/project.json', data, function (err) {
            if (err)
                win.webContents.send("createProjectErrorResponse", err.message);
            else
                win.webContents.send("createProjectResponse", project);
        });
    });
});
electron_1.ipcMain.on("deleteProject", function (event, projectName) {
    var homedir = require('os').homedir();
    fs.rmdir(homedir + '/dtp-ide/' + projectName, { recursive: true }, function (err) {
        if (err)
            throw err;
        getProjects();
    });
});
//# sourceMappingURL=main.js.map