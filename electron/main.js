const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const express = require('express');

const appServer = express();

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false
    },
  });

  // Load Angular build
  // mainWindow.loadFile(path.join(process.resourcesPath, "frontend", "./browser/index.html"));
  appServer.use(express.static(path.join(process.resourcesPath, "frontend", "./browser")));
  appServer.listen(4200, () => console.log("Angular served inside Electron"));

  mainWindow.loadURL('http://localhost:4200');

  //// FOR DEVELOPMENT ONLY
  mainWindow.webContents.openDevTools();
  
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) backendProcess.kill();
  });
}


app.on("ready", () => {
  // Start .NET API
  apiPath = path.join(process.resourcesPath, "backend", "quader-backend.exe");

  backendProcess = spawn(apiPath, [], { cwd: path.dirname(apiPath) });

  backendProcess.stdout.on("data", (data) => {
    console.log(`API: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`API Error: ${data}`);
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
