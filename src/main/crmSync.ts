import axios from 'axios'
import { SOP, SyncResult } from '../shared/types'

// Upload screenshot and return its hosted URL
async function uploadScreenshot(
  base64: string,
  apiUrl: string,
  token: string
): Promise<string> {
  const buffer = Buffer.from(base64, 'base64')
  const formData = new FormData()
  const blob = new Blob([buffer], { type: 'image/png' })
  formData.append('file', blob, 'screenshot.png')

  const res = await axios.post(`${apiUrl}/screenshots`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data.url as string
}

// Sync a full SOP to the CRM backend
export async function syncToCRM(
  sop: SOP,
  apiUrl: string,
  token: string
): Promise<SyncResult> {
  try {
    // Upload each screenshot and replace base64 with URL
    for (const step of sop.steps) {
      if (step.screenshot_base64) {
        step.screenshot_base64 = await uploadScreenshot(
          step.screenshot_base64,
          apiUrl,
          token
        )
      }
    }

    // Post the full SOP
    const res = await axios.post(`${apiUrl}/sops`, sop, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return { success: true, sopId: res.data.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    return { success: false, error: message }
  }
}
