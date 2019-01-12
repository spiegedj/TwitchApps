const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow()
{
    win = new BrowserWindow({ width: 1920, height: 1080 })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () =>
    {
        win = null
    });
}

app.on('ready', createWindow)
app.on('window-all-closed', () =>
{
    if (process && process.platform !== 'darwin')
    {
        app.quit()
    }
});
app.on('activate', () =>
{
    if (win === null)
    {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const exec = require('child_process').exec;
var process;
ipcMain.on('launch-stream', (event, streamName) =>
{
    var command = "\"livestreamer --twitch-oauth-token sgy4q0csvrylr2g2xyyi7hfc55ymvw twitch.tv/"
        + streamName + " 1080p60,720p60,best -np 'omxplayer -o hdmi'\"";
    command = "lxterminal -e " + command;
    process = exec(command, (error, stdout, stderr) => { });
});

ipcMain.on('stop-stream', (event) =>
{
    if (process)
    {
        var command = "killall livestreamer";
        exec(command);
    }
});

var fullscreen = false;
ipcMain.on("toggle-fullscreen", (event) =>
{
    fullscreen = !fullscreen;
    win.setFullScreen(fullscreen);
});

const express = require('express'), webServer = express();
var http = require('http').Server(webServer);

webServer.get('/stream', function (req, res)
{
    turnTVOn();
    win.webContents.send('stream', { streamer: req.query.streamer });
});

webServer.get('/stop', function (req, res)
{
    win.webContents.send('stop');
});

http.listen(3000, function ()
{
    console.log('listening on *:3000');
});

var turnTVOn = () =>
{
    var command = "echo on 0 | cec-client -s -d 1";
    process = exec(command);
}