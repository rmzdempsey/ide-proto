"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var spawn = require("child_process").spawn;
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
    var apps = templates.map(function (t) { return { template: t, branches: [], currentBranch: '' }; });
    var project = {
        name: projectName,
        apps: apps
    };
    var homedir = require('os').homedir();
    var projectDir = homedir + '/dtp-ide/' + projectName;
    fs.mkdir(projectDir, { recursive: true }, function (err) {
        if (err)
            throw err;
        var data = new Uint8Array(Buffer.from(JSON.stringify(project)));
        fs.writeFile(homedir + '/dtp-ide/' + projectName + '/project.json', data, function (err) {
            if (err)
                win.webContents.send("createProjectErrorResponse", err.message);
            else {
                win.webContents.send("createProjectResponse", project);
            }
        });
    });
});
electron_1.ipcMain.on("deleteProject", function (event, projectName) {
    var homedir = require('os').homedir();
    fs.rmdir(homedir + '/dtp-ide/' + projectName, { recursive: true }, function (err) {
        if (err)
            win.webContents.send("deleteProjectErrorResponse", projectName, err.message);
        else
            win.webContents.send("deleteProjectResponse");
    });
});
electron_1.ipcMain.on("cloneApps", function (event, project) {
    var homedir = require('os').homedir();
    var projectDir = homedir + '/dtp-ide/' + project['name'];
    project.apps.forEach(function (app) { return cloneApp(projectDir, app); });
});
function cloneApp(projDir, app) {
    var ls = spawn("git", ["clone", "--progress", "--verbose", app.template.repo, projDir + "/" + app.template.appName]);
    ls.stdout.on("data", function (data) {
        win.webContents.send("updateConsoleStdOut", app.template.appName, data);
    });
    ls.stderr.on("data", function (data) {
        win.webContents.send("updateConsoleStdErr", app.template.appName, data);
    });
    ls.on('error', function (error) {
        console.log("error: " + error.message);
    });
    ls.on("close", function (code) {
        if (code == 0) {
            getBranches(projDir, app);
        }
        else {
            console.log("child process exited with code " + code);
        }
    });
}
function getBranches(projDir, app) {
    var branches = [];
    var ls = spawn("git", ["branch", "-r"], { cwd: projDir + "/" + app.template.appName });
    ls.stdout.on("data", function (data) {
        var txt = String.fromCharCode.apply(null, data);
        var os = require('os');
        var lines = txt.split(os.EOL);
        lines.map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; }).filter(function (l) { return !l.startsWith('origin/HEAD'); }).map(function (l) { return l.substring(7); }).forEach(function (l) { return branches.push(l); });
        //console.log(`GB stdout branches: ${branches}`);
    });
    ls.stderr.on("data", function (data) {
        console.log("GB stderr: " + data);
    });
    ls.on('error', function (error) {
        console.log("GB error: " + error.message);
    });
    ls.on("close", function (code) {
        if (code == 0) {
            getCurrentBranch(projDir, app, branches);
        }
        else {
            console.log("GB child process exited with code " + code);
        }
    });
}
function getCurrentBranch(projDir, app, branches) {
    var ls = spawn("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: projDir + "/" + app.template.appName });
    var currentBranch;
    ls.stdout.on("data", function (data) {
        currentBranch = String.fromCharCode.apply(null, data);
    });
    ls.stderr.on("data", function (data) {
        console.log("GCB stderr: " + data);
    });
    ls.on('error', function (error) {
        console.log("CGB error: " + error.message);
    });
    ls.on("close", function (code) {
        if (code == 0) {
            win.webContents.send("appBranchInfo", app.template.appName, branches, currentBranch);
        }
        else {
            console.log("CGB child process exited with code " + code);
        }
    });
}
//# sourceMappingURL=main.js.map