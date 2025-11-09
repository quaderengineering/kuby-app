const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const { spawn } = require("child_process");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");
const express = require("express");
const usbDetect = require("usb-detection");

const appServer = express();

let mainWindow;
let backendProcess;
let a; //FIXME: wth is this name

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

async function findPicoSerial() {
  const ports = await SerialPort.list();

  for (const port of ports) {
    try {
      const serialPort = new SerialPort({
        path: port.path,
        baudRate: 115200,
        autoOpen: true,
      });

      const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

      const pingPromise = new Promise((resolve, reject) => {
        let found = false;
        parser.once("data", (line) => {
          if (line.trim() === "PICO") {
            found = true;
            resolve(port.path);
          } else {
            reject();
          }
          serialPort.close();
        });

        // Send PING after small delay
        setTimeout(() => {
          serialPort.write("PING\n", (err) => {
            if (err) reject(err);
          });
        }, 100);

        // Timeout after 1s
        setTimeout(() => {
          if (!found) {
            parser.removeAllListeners("data");
            serialPort.close();
            reject();
          }
        }, 1000);
      });

      const result = await pingPromise;
      if (result) return result;
    } catch {
      // continue to next port
    }
  }

  return null;
}

async function getTimers() {
  const picoPort = await findPicoSerial();
  if (!picoPort) throw new Error("Pico not detected");

  return new Promise((resolve, reject) => {
    const serialPort = new SerialPort({ path: picoPort, baudRate: 115200 });
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.once("data", (line) => {
      try {
        const json = JSON.parse(line.trim());
        serialPort.close();
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });

    serialPort.write("GET_TIMERS\n", (err) => {
      if (err) reject(err);
    });
  });
}

async function setTimers(timers) {
  const picoPort = await findPicoSerial();
  if (!picoPort) throw new Error("Pico not detected");

  return new Promise((resolve, reject) => {
    const serialPort = new SerialPort({ path: picoPort, baudRate: 115200 });
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.once("data", (line) => {
      if (line.trim() === "OK") {
        serialPort.close();
        resolve(true);
      } else {
        serialPort.close();
        reject(new Error("Error setting timers: " + line));
      }
    });

    const cmd = `SET_TIMERS ${JSON.stringify(timers)}\n`;
    serialPort.write(cmd, (err) => {
      if (err) reject(err);
    });
  });
}

async function refreshPorts() {
  const ports = await SerialPort.list();
  // console.log(
  //   "Available ports:",
  //   ports.map((p) => p.path)
  // );
  a = ports;
}

app.on("ready", async () => {
  // Start .NET API
  apiPath = path.join(process.resourcesPath, "backend", "API.Kuby.exe");

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
    usbDetect.stopMonitoring();
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

usbDetect.on("add", async () => await refreshPorts());
usbDetect.on("remove", async () => await refreshPorts());

ipcMain.handle("pico-get-timers", async () => {
  try {
    const timers = await getTimers();
    return { success: true, data: timers };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("pico-set-timers", async (_, timers) => {
  try {
    await setTimers(timers);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
