#!/usr/bin/env node

const packager = require('electron-packager')
const spawn = require('child_process').spawn

let options = {
  name: 'electron',
  version: process.argv[3] || undefined,
  dir: './electron-launcher',
  out: './build',
  platform: 'linux',
  arch: process.argv[2] || undefined,
  asar: true,
  download: {
    cache: './cache'
  },
  tmpdir: false
}

packager(options, (err, appPaths) => {
  if (err) throw err
  if (process.argv[4] !== 'compress') return
  appPaths.forEach((path) => {
    console.log('Compressing ' + path + '.tar.gz')
    spawn('tar', ['-zcf', path + '.tar.gz', '-C', path, '.'], {stdio: ['ignore', process.stdout, process.stderr]})
  })
})
