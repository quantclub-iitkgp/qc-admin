import { PhaseForm } from "../_components/phase-form"
import { createPhaseAction } from "../actions"

export default function NewPhasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">New Phase</h2>
        <p className="text-sm text-foreground/60">Add a new phase to the SoQ program</p>
      </div>
      <PhaseForm action={createPhaseAction} submitLabel="Create Phase" />
    </div>
  )
}
