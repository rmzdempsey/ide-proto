import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as fs from "fs";

let win: BrowserWindow

app.on('ready', createWindow)

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})



  function createWindow() {
    win = new BrowserWindow({ width: 1000, height: 800, webPreferences: { nodeIntegration: true } })
  
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../../dist/ide3/index.html`),
        protocol: 'file:',
        slashes: true,
      })
    )

    win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
    })
  }

function getTemplates() {
    
  fs.readdir('./templates', {withFileTypes: true}, (err, files) => {
    
      if (!err) {
          const templateFiles = files
            .filter(file => !file.isDirectory())
            .map(file => JSON.parse(fs.readFileSync('./templates/'+file.name,"utf8")));
          win.webContents.send("getTemplatesResponse", templateFiles);
      }
  });
}

ipcMain.on("getTemplates", (event) => {
  getTemplates();
});

function getProjects() {

  const homedir = require('os').homedir();
    
  fs.readdir( homedir + '/dtp-ide', {withFileTypes: true}, (err, files) => {
      if (!err) {
          const projectFiles = files
            .filter(file => file.isDirectory() && !file.name.startsWith("."))
            .map(file => JSON.parse(fs.readFileSync(homedir + '/dtp-ide/'+file.name+'/project.json',"utf8")));
          win.webContents.send("getProjectsResponse", projectFiles );
      }
  });
}

ipcMain.on("getProjects", (event) => {
  getProjects();
});

ipcMain.on("createProject", (event, projectName, templates) => {
  let project = {
    name: projectName,
    templates : templates
  }

  const homedir = require('os').homedir();
    
  fs.mkdir( homedir + '/dtp-ide/' + projectName , { recursive: true }, (err) => {
    if (err) throw err;
    const data = new Uint8Array(Buffer.from(JSON.stringify(project)));
    fs.writeFile(homedir + '/dtp-ide/' + projectName + '/project.json', data, (err) => {
      if (err) win.webContents.send("createProjectErrorResponse", err.message );
      else win.webContents.send("createProjectResponse", project );
    });
  });

});

ipcMain.on("deleteProject", (event, projectName) => {
  const homedir = require('os').homedir();
  fs.rmdir( homedir + '/dtp-ide/' + projectName , { recursive: true }, (err) => {
    if (err) throw err;
    getProjects();
  });
});
