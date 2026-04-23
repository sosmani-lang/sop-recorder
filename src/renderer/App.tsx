import { useState } from 'react'
import { Step } from '@shared/types'
import LoginScreen from './components/LoginScreen'
import FloatingToolbar from './components/FloatingToolbar'
import StepList from './components/StepList'
import SaveModal from './components/SaveModal'
import UpdateBanner from './components/UpdateBanner'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)

  // Show login if not authenticated
  if (!token) {
    return <LoginScreen onLogin={setToken} />
  }

  async function handleStart() {
    await window.electron.ipcRenderer.invoke('start-recording')
    setSteps([])
    setRecording(true)
    setPaused(false)
  }

  async function handleStop() {
    const captured: Step[] = await window.electron.ipcRenderer.invoke('stop-recording')
    setSteps(captured)
    setRecording(false)
    setPaused(false)
  }

  function handlePause() {
    setPaused(prev => !prev)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Auto-update banner */}
      <UpdateBanner />

      {/* Recording toolbar */}
      <FloatingToolbar
        recording={recording}
        paused={paused}
        stepCount={steps.length}
        onStart={handleStart}
        onStop={handleStop}
        onPause={handlePause}
      />

      {/* Step list */}
      <StepList steps={steps} onUpdate={setSteps} />

      {/* Bottom action bar */}
      {steps.length > 0 && !recording && (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setShowSaveModal(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            💾 Save to CRM ({steps.length} steps)
          </button>
        </div>
      )}

      {/* Save modal */}
      {showSaveModal && (
        <SaveModal
          steps={steps}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  )
}
