#!/usr/bin/env node

const packager = require('electron-packager')
const spawn = require('child_process').spawn

let options = {
  dir: 'app',
  out: 'build',
  platform: 'linux',
  arch: process.argv[2],
  overwrite: true,
  download: {
    cache: 'cache'
  }
}

packager(options, (err, appPaths) => {
  if (err) throw err
  appPaths.forEach((path) => {
    console.log('Compressing ' + path + '.tar.gz')
    spawn('tar', ['-zcf', path + '.tar.gz', '-C', path, '.'], {stdio: ['ignore', process.stdout, process.stderr]})
  })
})
