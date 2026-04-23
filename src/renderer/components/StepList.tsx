import { Step } from '@shared/types'

interface Props {
  steps: Step[]
  onUpdate: (steps: Step[]) => void
}

export default function StepList({ steps, onUpdate }: Props) {
  function updateDescription(index: number, description: string) {
    const updated = steps.map((s, i) => i === index ? { ...s, description } : s)
    onUpdate(updated)
  }

  function deleteStep(index: number) {
    onUpdate(steps.filter((_, i) => i !== index))
  }

  if (steps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        <div className="text-center">
          <p className="text-4xl mb-3">🎬</p>
          <p>Click Record to start capturing steps</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {/* Screenshot thumbnail */}
          {step.screenshot_base64 && (
            <img
              src={`data:image/png;base64,${step.screenshot_base64}`}
              alt={`Step ${step.step_number}`}
              className="w-full h-32 object-cover object-top"
            />
          )}

          <div className="p-3">
            {/* Step header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Step {step.step_number}
                </span>
                <span className="text-gray-400 text-xs">{step.app_name}</span>
              </div>
              <button
                onClick={() => deleteStep(index)}
                className="text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Editable description */}
            <input
              type="text"
              value={step.description}
              onChange={e => updateDescription(index, e.target.value)}
              className="w-full bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
