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

  windowSize = windowSize.split('x')
  windowSize.length = 2
  windowSize = windowSize.map((n) => parseInt(n, 10) || 0)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // very important!
      plugins: true,
      allowDisplayingInsecureContent: true
    },
    title: 'Lutris Electron Runner',
    width: windowSize[0] || 800,
    height: windowSize[1] || 600,
    useContentSize: true,
    center: true,
    autoHideMenuBar: true,
    show: false,
    icon: icon,
    fullscreen: args.includes('--fullscreen', 2) && !args.includes('--disable-resizing'),
    resizable: !args.includes('--disable-resizing'),
    backgroundColor: '#000000',
    frame: !args.includes('--frameless')
  })

  mainWindow.loadURL(inputUrl)

  if (args.includes('--devtools')) {
    mainWindow.webContents.openDevTools()
  }

  if (args.includes('--disable-menu-bar')) {
    mainWindow.setMenu(null)
  }

  let execjs = []

  execjs.push(`
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
  `)
  if (args.includes('--disable-scrolling')) {
    execjs.push('document.body.style.overflow = "hidden"')
  }
  if (args.includes('--hide-cursor')) {
    execjs.push('document.body.style.cursor = "none"')
  }

  execjs = execjs.join(';\n')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.executeJavaScript(execjs)
  })

  mainWindow.webContents.once('did-fail-load', (e, errorCode, errorDescription, validatedUrl, isMainFrame) => {
    if (!isMainFrame) return
    dialog.showErrorBox('Failed to load url', validatedUrl + '\n\n' + errorCode + ' ' + errorDescription)
    app.quit()
  })

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function handleRedirect (e, url) {
  if (url !== mainWindow.webContents.getURL() && !args.includes('--open-links')) {
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
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
