const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const express = require("express");
const { SerialPort } = require("serialport");
const usbDetect = require("usb-detection");

const appServer = express();

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
    },
  });

  // Load Angular build
  // mainWindow.loadFile(path.join(process.resourcesPath, "frontend", "./browser/index.html"));
  appServer.use(
    express.static(path.join(process.resourcesPath, "frontend", "./browser"))
  );
  // Always fallback to Angular index.html
  appServer.use((req, res) => {
    res.sendFile(
      path.join(process.resourcesPath, "frontend", "browser", "index.html")
    );
  });

  appServer.listen(4200, () => console.log("Angular served inside Electron"));

  //// FIXME: FOR DEVELOPMENT ONLY
  mainWindow.loadURL("http://localhost:4200");
  mainWindow.webContents.openDevTools();

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) backendProcess.kill();
  });
}

app.on("ready", async () => {
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

  usbDetect.startMonitoring();

  await refreshPorts();
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

usbDetect.on("add", async () => await refreshPorts());
usbDetect.on("remove", async () => await refreshPorts());

ipcMain.on("get-usb-data", (event) => {
  const fakeData = { status: "ok", value: 42 };
  event.sender.send("usb-data-response", fakeData);
});

async function refreshPorts() {
  const ports = await SerialPort.list();
  console.log(
    "Available ports:",
    ports.map((p) => p.path)
  );
}
