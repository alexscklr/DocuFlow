/**
 * Table Component for Projects
 * Displays a list of items with columns: Title, State, Version, Date
 * Styled to match the design system from ProfilePage
 */

export function Table({ data = [] }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 bg-white/5 px-6 py-4 border-b border-white/10">
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-300">Title</p>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-300">State</p>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-300">Version</p>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-300">Date</p>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-white/10">
        {data.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-400 text-sm">No items to display</p>
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-150">
              <div className="text-left">
                <p className="text-sm text-gray-200">{item.title}</p>
              </div>
              <div className="text-left">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.state}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400">{item.version}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400">{item.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
