import { useState, useEffect } from 'react'

export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('update-available', () => setUpdateAvailable(true))
    window.electron.ipcRenderer.on('update-downloaded', () => setUpdateReady(true))
  }, [])

  if (!updateAvailable) return null

  return (
    <div className="bg-indigo-900 border-b border-indigo-700 px-4 py-2 flex items-center justify-between">
      <span className="text-indigo-200 text-xs">
        {updateReady ? '✅ Update ready to install' : '⬇ Downloading update...'}
      </span>
      {updateReady && (
        <button
          onClick={() => window.electron.ipcRenderer.invoke('restart-to-update')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
        >
          Restart to Update
        </button>
      )}
    </div>
  )
}
