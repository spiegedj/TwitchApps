const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 1920, height: 1080 })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const exec = require('child_process').exec;
ipcMain.on('launch-stream', (event, streamName) => {
  var command = "livestreamer --twitch-oauth-token sgy4q0csvrylr2g2xyyi7hfc55ymvw twitch.tv/"
                + streamName + " 1080p60,720p60,best -np 'omxplayer -o hdmi";
                
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
});

// ipcMain.on('save-build', (event, json, filename) => {
//   writeToFile(json, filename);
// });

// function writeToFile(json, filename) {
//   dialog.showOpenDialog({
//     title: "Select a folder",
//     properties: ["openDirectory"]
//   }, function (folderPaths) {
//     if (folderPaths !== undefined) {
//       var filepath = folderPaths[0] + "/" + filename + ".json";
//       fs.writeFile(filepath, json, function (error) {
//         if (error) {
//           alert("An error occured writing to the file: " + err.message);
//           console.log(err);
//         }
//       });
//     }
//   });
// }