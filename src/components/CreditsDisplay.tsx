interface CreditsDisplayProps {
  totalCredits: number;
  scheduledCredits: number;
}

export function CreditsDisplay({ totalCredits, scheduledCredits }: CreditsDisplayProps) {
  return (
    <div className="rounded-lg p-4 border">
      <h3 className="text-sm font-medium mb-3">Credit Hours</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{totalCredits}</p>
          <p className="text-xs text-muted-foreground">Total (All)</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{scheduledCredits}</p>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </div>
      </div>
    </div>
  );
}
