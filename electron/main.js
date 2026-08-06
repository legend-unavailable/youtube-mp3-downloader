const {app, BrowserWindow, ipcMain, dialog, Menu, shell} = require('electron');
const path = require('path')
const fs = require('fs')
const {create} = require('youtube-dl-exec');
const { log, error } = require('console');


const isDev = !app.isPackaged;
const platform = process.platform;

const baseBinPath = isDev ? path.join(__dirname, '../bin', platform) : path.join(process.resourcesPath, platform);

const exeExtension = platform === 'win32' ? '.exe' : '';

const ytDlpPath = path.join(baseBinPath, `yt-dlp${exeExtension}`);
const ffmpegDir = baseBinPath;

const youtubeDL = create(ytDlpPath);

if (platform !== 'win32') {
    try {
        fs.chmodSync(ytDlpPath, '755');
        fs.chmodSync(path.join(ffmpegDir, 'ffmpeg'), '755');
        console.log();
    } catch (error) {
        console.error('failed');        
    }
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
            return {action: 'deny'};
        }
        return {action: 'allow'};
    })

    win.webContents.on('context-menu', (event, params) => {
        const contextMenuTemplate = [
            {role: 'cut', label: 'Cut'},
            {role: 'copy', label: 'Copy'},
            {role: 'paste', label: 'Paste'},
            {type: 'separator'},
            {role: 'selectAll', label: 'Select All'}
        ];

        const menu = Menu.buildFromTemplate(contextMenuTemplate);
        menu.popup({window: win, x: params.x, y: params.y});
    })

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {win.loadFile(path.join(__dirname, '../dist/index.html'))}
}


ipcMain.handle('download-mp3', async(event, url) => {
    const win = BrowserWindow.getFocusedWindow();

    const saveDialogResult = await dialog.showSaveDialog(win, {
        title: 'SaveAudioFile',
        defaultPath: path.join(app.getPath('music'), 'audio.mp3'),
        buttonLabel: 'Download',
        filters: [
            {name: 'Audio Files', extensions: ['mp3']}
        ]
    });

    if (saveDialogResult.canceled || !saveDialogResult.filePath) {
        return {success: false, error: 'Download cancelled by user'}
    }

    const chosenFinalMp3Path = saveDialogResult.filePath;

    const targetOutputTemplate = chosenFinalMp3Path.replace(/\.mp3$/, '.%(ext)s');

   /* const tempID = Date.now();
    const downloadFolder = app.getPath('downloads');
    const tempOutPath = path.join(downloadFolder, `youtube_${tempID}.%(ext)s`);
    const finalPath = path.join(downloadFolder, `youtube_${tempID}.mp3`);

    */
    console.log('downloading...');
    

    try {
        await youtubeDL(url, {
            jsRuntimes: 'node',
            extractAudio: true,
            audioFormat: 'mp3',
            audioQuality: 0,
            output: targetOutputTemplate,
            ffmpegLocation: ffmpegDir
        });
        console.log('Transcoding complete');
        //const permanentPath = path.join(downloadFolder, `youtube_${tempID}.mp3`);
        //fs.renameSync(finalPath, permanentPath);

        console.log('finished');       

        //server code
        return {success: true, message: 'download complete', savedTo: chosenFinalMp3Path};        
    } catch (error) {
        console.log('execution failed:', error);
        return {success: false, error: error.message};
    }
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'macOS') app.quit();
})