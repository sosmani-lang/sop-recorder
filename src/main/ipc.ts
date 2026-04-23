import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { startRecording, stopRecording, getSteps } from './recorder'
import { syncToCRM } from './crmSync'
import { saveCredentials, loadCredentials } from './storage'
import { login, getToken } from './auth'
import { SOP } from '../shared/types'

export function registerIPC(): void {
  // Recording controls
  ipcMain.handle('start-recording', () => {
    startRecording()
  })

  ipcMain.handle('stop-recording', () => {
    return stopRecording()
  })

  ipcMain.handle('get-steps', () => {
    return getSteps()
  })

  // CRM sync
  ipcMain.handle(
    'sync-to-crm',
    async (_event, { sop, apiUrl, token }: { sop: SOP; apiUrl: string; token: string }) => {
      return await syncToCRM(sop, apiUrl, token)
    }
  )

  // Credentials storage
  ipcMain.handle(
    'save-credentials',
    (_event, { apiUrl, token }: { apiUrl: string; token: string }) => {
      saveCredentials(apiUrl, token)
    }
  )

  ipcMain.handle('load-credentials', () => {
    return loadCredentials()
  })

  // Auth
  ipcMain.handle(
    'login',
    async (_event, { email, password }: { email: string; password: string }) => {
      return await login(email, password)
    }
  )

  ipcMain.handle('get-token', () => {
    return getToken()
  })

  // Auto updater
  ipcMain.handle('restart-to-update', () => {
    autoUpdater.quitAndInstall()
  })
}
