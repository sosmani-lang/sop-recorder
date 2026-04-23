import { Step } from '../shared/types'
import { UiohookMouse, uIOhook } from 'uiohook-rawinput'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const screenshot = require('screenshot-desktop')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const activeWin = require('active-win')

let steps: Step[] = []
let isRecording = false
let stepCounter = 1

async function captureScreenshot(): Promise<string> {
  try {
    const img: Buffer = await screenshot({ format: 'png' })
    return img.toString('base64')
  } catch {
    return ''
  }
}

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

async function onMouseClick(event: UiohookMouse) {
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

export function startRecording(): void {
  steps = []
  stepCounter = 1
  isRecording = true
  uIOhook.on('mousedown', onMouseClick)
  uIOhook.start()
}

export function stopRecording(): Step[] {
  isRecording = false
  uIOhook.off('mousedown', onMouseClick)
  uIOhook.stop()
  return steps
}

export function getSteps(): Step[] {
  return steps
}
