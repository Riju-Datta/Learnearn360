export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
          </svg>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
