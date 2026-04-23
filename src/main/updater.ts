import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'

export function initUpdater(mainWindow: BrowserWindow): void {
  // Check for updates silently on startup
  autoUpdater.checkForUpdatesAndNotify()

  // Notify renderer that an update is available
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available')
  })

  // Notify renderer that update is downloaded and ready to install
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto updater error:', err)
  })
}
