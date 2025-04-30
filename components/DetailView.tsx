export default function DetailView({ item, onClose }: { item: any, onClose: () => void }) {
  if (!item) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{item.name} - Detailed Analysis</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {item.value && (
            <div className="col-span-2 flex items-center mb-2">
              <div 
                className="w-8 h-8 rounded mr-2" 
                style={{backgroundColor: item.value}}
                aria-label={`Color sample: ${item.value}`}
              ></div>
              <span>{item.value}</span>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Key Metrics</h3>
            <p><span className="font-medium">Count:</span> {item.count}</p>
            <p><span className="font-medium">Weighted Score:</span> {item.weighted?.toFixed(2) || item.score?.toFixed(2)}</p>
            {item.percentage && (
              <p><span className="font-medium">Percentage:</span> {item.percentage}%</p>
            )}
          </div>
          
          {(item.top10 !== undefined) && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Ranking Distribution</h3>
              <p><span className="font-medium">Top 10:</span> {item.top10}</p>
              <p><span className="font-medium">Top 50:</span> {item.top50}</p>
              <p><span className="font-medium">All Bestsellers:</span> {item.top100 || item.count}</p>
            </div>
          )}
          
          {item.topColors && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Top Colors</h3>
              <ul className="list-disc pl-5">
                {item.topColors.map((color: string, idx: number) => (
                  <li key={idx}>{color}</li>
                ))}
              </ul>
            </div>
          )}
          
          {item.topMaterials && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Top Materials</h3>
              <ul className="list-disc pl-5">
                {item.topMaterials.map((material: string, idx: number) => (
                  <li key={idx}>{material}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
