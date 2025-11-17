export function SettingsLoadingState() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-14 bg-muted/50 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
