export default function ChartContainer({ height = 72, children }: { height: number, children: any }) {
  return (
    <div className={`h-${height}`}>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
