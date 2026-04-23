import { safeStorage, app } from 'electron'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { CRMCredentials } from '../shared/types'

function getCredentialsPath(): string {
  return join(app.getPath('userData'), 'credentials.enc')
}

// Save API credentials securely
export function saveCredentials(apiUrl: string, token: string): void {
  const data = JSON.stringify({ apiUrl, token })
  const encrypted = safeStorage.encryptString(data)
  writeFileSync(getCredentialsPath(), encrypted)
}

// Load and decrypt saved credentials
export function loadCredentials(): CRMCredentials | null {
  const path = getCredentialsPath()
  if (!existsSync(path)) return null

  try {
    const encrypted = readFileSync(path)
    const decrypted = safeStorage.decryptString(encrypted)
    return JSON.parse(decrypted) as CRMCredentials
  } catch {
    return null
  }
}
