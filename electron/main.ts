import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as fs from "fs";

const { spawn } = require("child_process");

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
  let apps : Array<any> = templates.map(t=>{return {template:t,branches:[],currentBranch:''}})
  let project = {
    name: projectName,
    apps : apps
  }

  const homedir = require('os').homedir();
  const projectDir = homedir + '/dtp-ide/' + projectName
    
  fs.mkdir( projectDir , { recursive: true }, (err) => {
    if (err) throw err;
    const data = new Uint8Array(Buffer.from(JSON.stringify(project)));
    fs.writeFile(homedir + '/dtp-ide/' + projectName + '/project.json', data, (err) => {
      if (err) win.webContents.send("createProjectErrorResponse", err.message );
      else {
        win.webContents.send("createProjectResponse", project );
      }
    });
  });

});

ipcMain.on("deleteProject", (event, projectName) => {
  const homedir = require('os').homedir();
  fs.rmdir( homedir + '/dtp-ide/' + projectName , { recursive: true }, (err) => {
    if (err) win.webContents.send("deleteProjectErrorResponse", projectName, err.message );
    else win.webContents.send("deleteProjectResponse");
  });
});

ipcMain.on("cloneApps", (event, project) => {
  
  const homedir = require('os').homedir();
  const projectDir = homedir + '/dtp-ide/' + project['name']
  project.apps.forEach(app=>cloneApp(projectDir, app))
});

function cloneApp(projDir, app){
  const ls = spawn("git", ["clone", "--progress", "--verbose", app.template.repo, projDir + "/" + app.template.appName]);

  ls.stdout.on("data", data => {
    win.webContents.send("updateConsoleStdOut", app.template.appName, data );
  });

  ls.stderr.on("data", data => {
    win.webContents.send("updateConsoleStdErr", app.template.appName, data );
  });

  ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  ls.on("close", code => {
      if( code == 0 ){
        getBranches(projDir, app);
      }
      else{
        console.log(`child process exited with code ${code}`);
      }
  });
}

function getBranches(projDir, app){
  const branches : Array<string> = [];
  const ls = spawn("git", ["branch", "-r"], {cwd: projDir + "/" + app.template.appName });

  ls.stdout.on("data", data => {
    const txt = String.fromCharCode.apply(null, data)
    var os = require('os');

    const lines = txt.split(os.EOL);
    lines.map(l=>l.trim()).filter(l=>l.length > 0 ).filter(l=>!l.startsWith('origin/HEAD')).map(l=>l.substring(7)).forEach(l=>branches.push(l))
    //console.log(`GB stdout branches: ${branches}`);
  });

  ls.stderr.on("data", data => {
    console.log(`GB stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`GB error: ${error.message}`);
  });

  ls.on("close", code => {
      if( code == 0 ){
        getCurrentBranch(projDir,app, branches)
      }
      else{
        console.log(`GB child process exited with code ${code}`);
      }
  });
}

function getCurrentBranch(projDir, app, branches){
  const ls = spawn("git", ["rev-parse", "--abbrev-ref", "HEAD"], {cwd: projDir + "/" + app.template.appName });
  let currentBranch;

  ls.stdout.on("data", data => {
    currentBranch = String.fromCharCode.apply(null, data)
  });

  ls.stderr.on("data", data => {
    console.log(`GCB stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`CGB error: ${error.message}`);
  });

  ls.on("close", code => {
      if(code==0){
        win.webContents.send("appBranchInfo", app.template.appName, branches, currentBranch );
      }
      else{
        console.log(`CGB child process exited with code ${code}`);
      }
      
  });
}
