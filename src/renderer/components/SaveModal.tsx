import { useState, useEffect } from 'react'
import { Step, SOP } from '@shared/types'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  steps: Step[]
  onClose: () => void
}

export default function SaveModal({ steps, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [token, setToken] = useState('')
  const [saveCredentials, setSaveCredentials] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Load saved credentials on open
  useEffect(() => {
    window.electron.ipcRenderer.invoke('load-credentials').then((creds) => {
      if (creds) {
        setApiUrl(creds.apiUrl)
        setToken(creds.token)
      }
    })
  }, [])

  async function handleSave() {
    setLoading(true)
    setResult(null)

    if (saveCredentials) {
      await window.electron.ipcRenderer.invoke('save-credentials', { apiUrl, token })
    }

    const sop: SOP = {
      id: uuidv4(),
      title,
      created_at: new Date().toISOString(),
      steps
    }

    const res = await window.electron.ipcRenderer.invoke('sync-to-crm', { sop, apiUrl, token })

    setResult({
      success: res.success,
      message: res.success ? 'SOP saved to CRM successfully!' : res.error ?? 'Failed to save'
    })

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm border border-gray-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Save SOP to CRM</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">SOP Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. How to process an invoice"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">API Endpoint</label>
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="https://your-crm.com/api"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Bearer Token</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCredentials}
              onChange={e => setSaveCredentials(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-300 text-sm">Remember credentials</span>
          </label>

          {result && (
            <p className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={loading || !title || !apiUrl || !token}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : `Save ${steps.length} Steps to CRM`}
          </button>
        </div>
      </div>
    </div>
  )
}
