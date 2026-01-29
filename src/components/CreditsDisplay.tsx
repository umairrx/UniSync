interface CreditsDisplayProps {
  totalCredits: number;
  scheduledCredits: number;
}

export function CreditsDisplay({ totalCredits, scheduledCredits }: CreditsDisplayProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Total Credits:</span>
        <span className="font-bold">{totalCredits}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Scheduled:</span>
        <span className="font-bold text-primary">{scheduledCredits}</span>
      </div>
    </div>
  );
}
