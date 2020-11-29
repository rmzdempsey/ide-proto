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
    win = new BrowserWindow({ width: 1200, height: 800, webPreferences: { nodeIntegration: true } })
  
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
        win.webContents.send("createProjectResponse", {name:project.name, templateNames: templates.map(t=>t.appName)} );
      }
    });
  });

});

ipcMain.on("deleteProject", (event, projectName) => {
  const homedir = require('os').homedir();
  fs.rmdir( homedir + '/dtp-ide/' + projectName , { recursive: true }, (err) => {
    if (err) win.webContents.send("deleteProjectErrorResponse", projectName, err.message );
    else win.webContents.send("deleteProjectResponse",projectName);
  });
});

ipcMain.on("cloneApps", (event, project) => {
  
  const homedir = require('os').homedir();
  const projectDir = homedir + '/dtp-ide/' + project['name']
  project.apps.forEach(app=>cloneApp(projectDir, project, app))
});

function cloneApp(projDir, project, app){
  if (!fs.existsSync(projDir + "/" + app.template.appName)){
    const ls = spawn("git", ["clone", "--progress", "--verbose", app.template.repo, projDir + "/" + app.template.appName]);

    ls.stdout.on("data", data => {
      const line : string = String.fromCharCode.apply(null, data)
      win.webContents.send("updateConsoleStdOut", app.template.appName, line );
    });

    ls.stderr.on("data", data => {
      const line : string = String.fromCharCode.apply(null, data)
      win.webContents.send("updateConsoleStdErr", app.template.appName, line );
    });

    ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    ls.on("close", code => {
      if( code == 0 ){
        getBranches(projDir, project, app);
      }
    });
  }
  else{
    getBranches(projDir, project, app);
  }
}

function getBranches(projDir, project, app){
  const branches : Array<string> = [];
  const ls = spawn("git", ["branch", "-r"], {cwd: projDir + "/" + app.template.appName });

  ls.stdout.on("data", data => {
    const txt = String.fromCharCode.apply(null, data)
    var os = require('os');

    const lines = txt.split(os.EOL);
    lines.map(l=>l.trim()).filter(l=>l.length > 0 ).filter(l=>!l.startsWith('origin/HEAD')).map(l=>l.substring(7)).forEach(l=>branches.push(l))
  });

  ls.stderr.on("data", data => {
    console.log(`GB stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`GB error: ${error.message}`);
  });

  ls.on("close", code => {
      if( code == 0 ){
        app.branches = branches;
        getCurrentBranch(projDir, project, app)
      }
      else{
        console.log(`GB child process exited with code ${code}`);
      }
  });
}

function getCurrentBranch(projDir, project, app){
  const ls = spawn("git", ["rev-parse", "--abbrev-ref", "HEAD"], {cwd: projDir + "/" + app.template.appName });
  let currentBranch : string;

  ls.stdout.on("data", data => {
    currentBranch = String.fromCharCode.apply(null, data).trim()
  });

  ls.stderr.on("data", data => {
    console.log(`GCB stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`CGB error: ${error.message}`);
  });

  ls.on("close", code => {
      if(code==0){
        app.currentBranch = currentBranch
        win.webContents.send("appBranchInfo", project );
      }
      else{
        console.log(`CGB child process exited with code ${code}`);
      }
      
  });
}

ipcMain.on("changeBranch", (event, projectName, appName, branchName) => {
  const homedir = require('os').homedir();
  const appDir = homedir + '/dtp-ide/' + projectName + '/' + appName

  const ls = spawn("git", ["checkout", branchName], {cwd: appDir });

  ls.stdout.on("data", data => {
    let line = String.fromCharCode.apply(null, data).trim()
    win.webContents.send("updateConsoleStdOut", appName, line );
      //currentBranch = String.fromCharCode.apply(null, data).trim()
    });
  
    ls.stderr.on("data", data => {
      let line = String.fromCharCode.apply(null, data).trim()
      win.webContents.send("updateConsoleStdErr", appName, line );
    });
  
    ls.on('error', (error) => {
        console.log(`CkB error: ${error.message}`);
    });
  
    ls.on("close", code => {
      if( code != 0 )
        console.log(`CkB child process exited with code ${code}`);
      else{
        win.webContents.send("branchChangedSuccess", projectName, appName, branchName );
      }
      
    });
});

ipcMain.on("initialiseIde", (event) => {
  fs.readdir('./templates', {withFileTypes: true}, (err, files) => {
    
    if (!err) {
      const templateFiles = files
        .filter(file => !file.isDirectory())
        .map(file => JSON.parse(fs.readFileSync('./templates/'+file.name,"utf8")));
      
      const homedir = require('os').homedir();
    
      fs.readdir( homedir + '/dtp-ide', {withFileTypes: true}, (err, files) => {
          if (!err) {
            const projectFiles = files
              .filter(file => file.isDirectory() && !file.name.startsWith("."))
              .map(file => {
                let obj = JSON.parse(fs.readFileSync(homedir + '/dtp-ide/'+file.name+'/project.json',"utf8"));
                return {name:file.name,templateNames:obj.apps.map(a=>a.template.appName) }
              });

            win.webContents.send("initialiseIdeSuccess", templateFiles, projectFiles );
          }
      });
    }
  });
})

