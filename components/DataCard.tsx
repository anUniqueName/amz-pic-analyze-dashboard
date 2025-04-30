export default function DataCard({ title, children, className = '' }: { title: string, children: any, className?: string }) {
  return (
    <div className={`bg-white p-5 rounded-lg shadow-md border border-gray-200 ${className}`}>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
