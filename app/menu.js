
const electron = require('electron')
const {dialog, shell} = electron

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) {
            dialog.showMessageBox(focusedWindow, {
              type: 'question',
              buttons: ['Yes', 'Cancel'],
              defaultId: 0,
              cancelId: 1,
              message: 'Are you sure you want to reload the page?'
            }, (response) => {
              if (response === 0) focusedWindow.reload()
            })
          }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      /*
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      */
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Lutris website',
        click () { shell.openExternal('https://lutris.net/') }
      }
    ]
  }
]

module.exports = template
