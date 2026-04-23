import { Step } from '../shared/types'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const iohook = require('iohook')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const screenshot = require('screenshot-desktop')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const activeWin = require('active-win')

let steps: Step[] = []
let isRecording = false
let stepCounter = 1

// Captures a screenshot and returns it as base64
async function captureScreenshot(): Promise<string> {
  try {
    const img: Buffer = await screenshot({ format: 'png' })
    return img.toString('base64')
  } catch {
    return ''
  }
}

// Gets the currently active window info
async function getActiveWindow(): Promise<{ appName: string; windowTitle: string }> {
  try {
    const win = await activeWin()
    return {
      appName: win?.owner?.name ?? 'Unknown',
      windowTitle: win?.title ?? 'Unknown'
    }
  } catch {
    return { appName: 'Unknown', windowTitle: 'Unknown' }
  }
}

// Called on every mouse click
async function onMouseClick(event: { x: number; y: number }) {
  if (!isRecording) return

  const [screenshot_base64, windowInfo] = await Promise.all([
    captureScreenshot(),
    getActiveWindow()
  ])

  const step: Step = {
    step_number: stepCounter++,
    app_name: windowInfo.appName,
    window_title: windowInfo.windowTitle,
    description: `Clicked at (${event.x}, ${event.y}) in ${windowInfo.appName}`,
    screenshot_base64,
    click_x: event.x,
    click_y: event.y,
    timestamp: Date.now()
  }

  steps.push(step)
}

// Start recording user actions
export function startRecording(): void {
  steps = []
  stepCounter = 1
  isRecording = true

  iohook.on('mouseclick', onMouseClick)
  iohook.start()
}

// Stop recording and return all captured steps
export function stopRecording(): Step[] {
  isRecording = false
  iohook.off('mouseclick', onMouseClick)
  iohook.stop()
  return steps
}

// Get current steps without stopping
export function getSteps(): Step[] {
  return steps
}
