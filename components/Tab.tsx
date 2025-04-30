export default function Tab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      className={`px-4 py-2 rounded-lg ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
