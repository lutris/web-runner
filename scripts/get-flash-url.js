#!/usr/bin/env node

const get = require('simple-get')

let arch = process.argv[2] || ''
let version = process.argv[3] || ''

let jsonurl = 'https://get.adobe.com/flashplayer/webservices/json/?platform_type=Linux&platform_dist=&platform_arch=' + arch + '&browser_arch=&browser_type=&browser_vers=&browser_dist=Chrome&eventname=flashplayerotherversions'

get.concat({method: 'GET', url: jsonurl, json: true}, (err, res, data) => {
  if (err) throw err
  for (let i = 0; i < data.length; i++) {
    let v = data[i]
    if (v.download_url.includes('ppapi') && (!arch || arch === v.installer_architecture)) {
      if (version) {
        // force version
        console.log(v.installer_architecture, version, v.download_url.replace(v.Version, version))
      } else {
        console.log(v.installer_architecture, v.Version, v.download_url)
      }
    }
  }
})
