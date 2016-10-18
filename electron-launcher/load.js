'use strict'

const path = require('path')
const fs = require('fs')
const Module = require('module')
const { app } = require('electron')

// Do not run sub-processes with lutris runtime!
delete process.env.LD_LIBRARY_PATH

if (process.env.ENABLE_FLASH_PLAYER && process.env.ENABLE_FLASH_PLAYER === '1' && !process.flashEnabled) {
  let exepath = app.getPath('exe')
  let apppath = app.getAppPath()

  let flashpaths = [path.join(apppath, '../../../PepperFlash'), path.join(exepath, '../PepperFlash'), '/usr/lib/PepperFlash', '/usr/lib/chromium-browser']

  let flashlib = null
  let flashversion = null
  for (var i = 0; i < flashpaths.length; i++) {
    let version
    let flashExist = false
    try {
      fs.accessSync(flashpaths[i] + '/libpepflashplayer.so', fs.constants.R_OK)
      flashExist = true
      let manifest = fs.readFileSync(flashpaths[i] + '/manifest.json', 'utf8')
      version = JSON.parse(manifest).version
    } catch (err) {
      // console.error(err + '')
    }
    if (flashExist) {
      // flash version read successfully. use this flash path!
      flashlib = flashpaths[i] + '/libpepflashplayer.so'
      flashversion = version
      break
    }
  }

  if (flashlib) {
    process.flashEnabled = true
    console.log('Using Flash player ' + flashlib + ' ' + (flashversion || '(unknown version)'))
    app.commandLine.appendSwitch('ppapi-flash-path', flashlib)
    if (flashversion) {
      app.commandLine.appendSwitch('ppapi-flash-version', flashversion)
    }
  }
}

if (!process.defaultApp && process.argv[1]) {
  // Remove this from cache so it can be loaded again.
  delete require.cache[require.resolve(path.join(__dirname, '/load.js'))]
  loadApplicationPackage(process.argv[1])
} else {
  require(path.join(__dirname, 'main'))
}

// code from https://github.com/electron/electron/blob/master/default_app/main.js
function loadApplicationPackage (packagePath) {
  // Add a flag indicating app is started from default app.
  process.defaultApp = true

  try {
    // Override app name and version.
    packagePath = path.resolve(packagePath)
    const packageJsonPath = path.join(packagePath, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      let packageJson
      try {
        packageJson = require(packageJsonPath)
      } catch (e) {
        console.error(`Unable to parse ${packageJsonPath}\n\n${e.message}`)
        return
      }

      if (packageJson.version) {
        app.setVersion(packageJson.version)
      }
      if (packageJson.productName) {
        app.setName(packageJson.productName)
      } else if (packageJson.name) {
        app.setName(packageJson.name)
      }
      app.setPath('userData', path.join(app.getPath('appData'), app.getName()))
      app.setPath('userCache', path.join(app.getPath('cache'), app.getName()))
      app.setAppPath(packagePath)
    }

    try {
      Module._resolveFilename(packagePath, module, true)
    } catch (e) {
      console.error(`Unable to find Electron app at ${packagePath}\n\n${e.message}`)
      return
    }

    // Run the app.
    Module._load(packagePath, module, true)
  } catch (e) {
    console.error('App threw an error during load')
    console.error(e.stack || e)
    throw e
  }
}
