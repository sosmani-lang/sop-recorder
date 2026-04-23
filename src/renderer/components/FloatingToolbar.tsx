interface Props {
  recording: boolean
  paused: boolean
  stepCount: number
  onStart: () => void
  onStop: () => void
  onPause: () => void
}

export default function FloatingToolbar({ recording, paused, stepCount, onStart, onStop, onPause }: Props) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {recording && !paused ? (
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        ) : paused ? (
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
        ) : (
          <span className="w-3 h-3 bg-gray-500 rounded-full" />
        )}
        <span className="text-gray-300 text-sm font-medium">
          {recording && !paused ? 'Recording...' : paused ? 'Paused' : 'Ready'}
        </span>
        {stepCount > 0 && (
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
            {stepCount} steps
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!recording ? (
          <button
            onClick={onStart}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
          >
            ● Record
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={onStop}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              ■ Stop
            </button>
          </>
        )}
      </div>
    </div>
  )
}
