export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-500">Loading recipes...</p>
      </div>
    </div>
  );
} 