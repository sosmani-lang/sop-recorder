export interface Step {
  step_number: number
  app_name: string
  window_title: string
  description: string
  screenshot_base64: string
  click_x: number
  click_y: number
  timestamp: number
}

export interface SOP {
  id: string
  title: string
  created_at: string
  steps: Step[]
}

export interface CRMCredentials {
  apiUrl: string
  token: string
}

export interface AuthResult {
  success: boolean
  token?: string
  error?: string
}

export interface SyncResult {
  success: boolean
  sopId?: string
  error?: string
}
