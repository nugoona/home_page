export default function GridDivider({ cols = 12 }: { cols?: number }) {
  return (
    <div
      className="w-full grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        borderTop: '0.5px solid var(--color-border-default)',
        borderBottom: '0.5px solid var(--color-border-default)',
      }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="aspect-square"
          style={{
            boxShadow: i < cols - 1 ? '1px 0 0 var(--color-border-default)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
