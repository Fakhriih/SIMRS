export default function Header({ title = 'Dashboard' }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-xs">
          U
        </div>
      </div>
    </header>
  )
}
