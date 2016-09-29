'use strict'

const electron = require('electron')
const path = require('path')

const {app, BrowserWindow, Menu, dialog, shell} = electron

const args = process.argv.slice(2)
console.log(args)

let inputUrl = args[0]
let icon = args[1] || path.join(__dirname, 'electron.png')

const appMenu = Menu.buildFromTemplate(require('./menu'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  if (!inputUrl) {
    dialog.showErrorBox('No input url', '')
    app.quit()
    return
  }
  let windowSize = ''
  let p = args.indexOf('--window')
  if (p !== -1) {
    windowSize = args[p+1] || 'x'
  }
  windowSize = windowSize.split('x').map((n) => parseInt(n, 10))

  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // very important,
      plugins: true
    },
    title: 'Lutris Electron Runner',
    width: windowSize[0] || 800,
    height: windowSize[1] || 600,
    useContentSize: true,
    autoHideMenuBar: true,
    center: true,
    show: false,
    icon: icon,
    fullscreen: args.includes('--fullscreen', 2),
    backgroundColor: '#000000'
  })

  mainWindow.loadURL(inputUrl)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    if (args.includes('--disable-scrolling')) {
      mainWindow.webContents.executeJavaScript('document.body.style.overflow = "hidden"')
    }
    mainWindow.show()
  })

  mainWindow.webContents.once('did-fail-load', (e, errorCode, errorDescription, validatedUrl, isMainFrame) => {
    if (!isMainFrame) return
    dialog.showErrorBox('Failed to load url', validatedUrl + '\n\n' + errorCode + ' ' + errorDescription)
    app.quit()
  })

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function handleRedirect (e, url) {
  if (url !== mainWindow.webContents.getURL()) {
    e.preventDefault()
    console.log('Opening url ' + url + ' in external browser')
    shell.openExternal(url)
  }
}

Menu.setApplicationMenu(appMenu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
