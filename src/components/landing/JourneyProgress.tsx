interface JourneyProgressProps {
  progress: number;
  foundCount: number;
  totalCount: number;
}

const JourneyProgress = ({ progress, foundCount, totalCount }: JourneyProgressProps) => {
  return (
    <div className="px-6 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Journey Progress</span>
          <span className="text-sm font-medium text-foreground">
            {foundCount} / {totalCount} words
          </span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyProgress;
