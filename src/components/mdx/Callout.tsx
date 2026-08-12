export function Callout({ children, type = "info" }: { children: React.ReactNode; type?: string }) {
  return (
    <div className="my-4 rounded-lg border border-border bg-muted/50 p-3.5 text-sm sm:p-4" data-callout={type}>
      {children}
    </div>
  );
}
