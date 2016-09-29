'use strict'

// from https://github.com/electron/electron/blob/master/default_app/main.js

const path = require('path')
const fs = require('fs')
const Module = require('module')
const { app } = require('electron')

console.log(process.argv[1])

if (!process.defaultApp && process.argv[1]) {
  // Remove this from cache so it can be loaded again.
  delete require.cache[require.resolve(path.join(__dirname, '/load.js'))]
  loadApplicationPackage(process.argv[1])
} else {
  require(path.join(__dirname, 'main'))
}

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
